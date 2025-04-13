use futures_util::{sink::SinkExt, stream::StreamExt};
use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;
use tokio::net::TcpListener;
use tokio_tungstenite::{tungstenite::protocol::Message, accept_async};

async fn handle_connection(ws_stream: tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>) {
    let (mut write, _) = ws_stream.split();
    let mut rng = StdRng::from_entropy();

    loop {
        let value: f64 = rng.gen_range(0.0..100.0);
        let msg = format!("{:.2}", value);

        if let Err(e) = write.send(Message::Text(msg)).await {
            eprintln!("Error sending message: {}", e);
            break;
        }

        tokio::time::sleep(std::time::Duration::from_millis(600)).await;
    }
}

#[tokio::main]
async fn main() {
    let addr = "127.0.0.1:8080";
    let listener = TcpListener::bind(&addr).await.expect("Cannot bind to address");

    println!("Listening on ws://{}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(async move {
            if let Ok(ws_stream) = accept_async(stream).await {
                handle_connection(ws_stream).await;
            } else {
                eprintln!("Error accepting connection");
            }
        });
    }
}

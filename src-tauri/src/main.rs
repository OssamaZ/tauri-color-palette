// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enterpolation::{linear::ConstEquidistantLinear, Curve};
use palette::{rgb::Rgb, Srgb};
use serde::{Deserialize, Serialize};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello {name} You've been greeted from Rust!")
}

#[derive(Serialize, Deserialize)]
struct Color {
    red: u8,
    green: u8,
    blue: u8,
}

#[tauri::command]
fn generate_palette(color: Color) -> Vec<(Color, String)> {
    let gradient = ConstEquidistantLinear::<f32, _, 2>::equidistant_unchecked([
        Srgb::new(color.red as f32, color.green as f32, color.blue as f32),
        Srgb::new(255.0, 255.0, 255.0),
    ]);

    let taken_colors: Vec<_> = gradient
        .take(10)
        .map(
            |Rgb {
                 red, green, blue, ..
             }| {
                let red = red as u8;
                let green = green as u8;
                let blue = blue as u8;
                (
                    Color { red, green, blue },
                    format!("rgb({}, {}, {})", red, green, blue),
                )
            },
        )
        .collect();

    taken_colors
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, generate_palette])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

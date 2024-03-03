// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{default, net::IpAddr};

use local_ip_address::{list_afinet_netifas, local_ip};
use tauri::{AppHandle, Manager, WindowBuilder, WindowUrl};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_overlay_window(app: AppHandle) -> Result<(), String> {
    let result = WindowBuilder::new(&app, "second", WindowUrl::App("/overlay".into()))
        .decorations(false)
        .transparent(true)
        .maximized(true)
        .build();

    match result {
        Ok(_) => {
            println!("Window created successfully!");
            Ok(())
        }
        Err(err) => Err(err.to_string()),
    }
}

#[derive(serde::Deserialize, serde::Serialize, Debug)]
struct MyCustomData {
    pub nama: String,
}

#[tauri::command]
fn custom_payload(mut payload: MyCustomData) -> MyCustomData {
    println!("{:?}", payload);

    payload.nama = format!(
        "Hello, {}! You've been greeted by Custom Function",
        payload.nama
    );
    payload
}

#[tauri::command]
async fn my_ip() -> Result<IpAddr, String>
// ? Using fetch
// Result<HashMap<String, String>, String>
{
    // ? Using fetch
    // let resp = reqwest::get("https::httpbin.org/ip").await.map_err(|err| err.to_string())?.json::<HashMap<String, String>>().await.map_err(|err| err.to_string())?;
    // Ok(resp)

    // Using library
    let network_interfaces = list_afinet_netifas().unwrap();

    for (name, ip) in network_interfaces.iter() {
        println!("{}:\t{:?}", name, ip);
    }

    let my_local_ip = local_ip().unwrap();

    Ok(my_local_ip)
}

#[tauri::command]
async fn window_label(window: tauri::Window) -> String {
    window.label().to_string()
}

#[derive(Default)]
struct Counter(i32);

#[tauri::command]
fn state(count_state: tauri::State<'_, Counter>) -> i32 {
    // counter_state.0 += 1
    count_state.0
}

#[derive(Default)]
struct CounterMut {
    count: std::sync::Mutex<i32>,
}

#[tauri::command]
fn event_and_state_inc_mut(
    app_handle: tauri::AppHandle,
    count_state: tauri::State<'_, CounterMut>,
) {
    *count_state.count.lock().unwrap() += 1;
    let count = *count_state.count.lock().unwrap();

    app_handle
        .emit_all("event_and_state_inc_mut", count)
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .manage(CounterMut { count: 0.into() })
        .manage(Counter(0.into()))
        .invoke_handler(tauri::generate_handler![
            greet,
            open_overlay_window,
            custom_payload,
            my_ip,
            window_label,
            state,
            event_and_state_inc_mut
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

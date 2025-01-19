const STARTING_MISSILES: i32 = 8;
const READY_AMOUNT: i32 = 2;

fn main() {
    let missiles = 8;
    let ready = 2;
    println!("Firing {} of my {} missiles...", STARTING_MISSILES, READY_AMOUNT);
    let missiles = missiles - ready;
    println!("{} missiles left", missiles);

}

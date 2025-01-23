#![allow(unused_mut, unused_variables)]

// 1. Define the `Bite` trait
trait Bite {
    fn bite(&mut self);
}

// 2. Define the `Grapes` struct
#[derive(Debug)]
struct Grapes {
    amount_left: u32,
}

// 3. Implement `Bite` for `Grapes`
impl Bite for Grapes {
    fn bite(&mut self) {
        if self.amount_left > 0 {
            self.amount_left -= 1;
        }
    }
}

// Challenge: Define the `bunny_nibbles` function
fn bunny_nibbles<T: Bite>(food: &mut T) {
    for _ in 0..5 {
        food.bite();
    }
}

fn main() {
    // Carrot example
    let mut carrot = Carrot { percent_left: 100.0 };
    carrot.bite();
    println!("I take a bite: {:?}", carrot);

    // Grapes example
    let mut grapes = Grapes { amount_left: 100 };
    grapes.bite();
    println!("Eat a grape: {:?}", grapes);

    // Challenge: Bunny nibbles
    bunny_nibbles(&mut carrot);
    println!("Bunny nibbles for awhile: {:?}", carrot);

    bunny_nibbles(&mut grapes);
    println!("Bunny nibbles for awhile: {:?}", grapes);
}

#[derive(Debug)]
struct Carrot {
    percent_left: f32,
}

impl Bite for Carrot {
    fn bite(&mut self) {
        self.percent_left *= 0.8;
    }
}
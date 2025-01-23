use rand::Rng;

// 1. Define the `Shot` enum
#[derive(Debug)]
enum Shot {
    FreeThrow,
    TwoPointer,
    ThreePointer,
}

// 2. Implement the `points` method for `Shot`
impl Shot {
    fn points(&self) -> i32 {
        match self {
            Shot::FreeThrow => 1,
            Shot::TwoPointer => 2,
            Shot::ThreePointer => 3,
        }
    }
}

fn main() {
    // Example usage of the `Shot` enum
    let shot = Shot::ThreePointer;
    println!("Shot: {:?}, Points: {}", shot, shot.points());

    // Example usage of random coordinates
    let (x, y) = generate_random_coordinates();
    println!("Random coordinates: ({}, {})", x, y);

    // Example of a vector of shots
    let mut shots: Vec<Shot> = Vec::new();
    shots.push(Shot::FreeThrow);
    shots.push(Shot::TwoPointer);
    shots.push(Shot::ThreePointer);

    // Calculate total points
    let total_points: i32 = shots.iter().map(|shot| shot.points()).sum();
    println!("Total points: {}", total_points);
}

// 3. Function to generate random coordinates
fn generate_random_coordinates() -> (f64, f64) {
    let mut rng = rand::thread_rng();
    let x: f64 = rng.gen(); // Generates a random f64 between 0.0 and 1.0
    let y: f64 = rng.gen(); // Generates a random f64 between 0.0 and 1.0
    (x, y)
}
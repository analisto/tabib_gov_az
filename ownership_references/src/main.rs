#![allow(unused_mut, unused_variables)]

// 1. Define the `inspect` function
fn inspect(s: &String) {
    if s.ends_with("s") {
        println!("The string is plural.");
    } else {
        println!("The string is singular.");
    }
}

// 2. Define the `change` function
fn change(s: &mut String) {
    if !s.ends_with("s") {
        s.push_str("s");
    }
}

// 3. Define the `eat` function
fn eat(s: String) -> bool {
    s.starts_with("b") && s.contains("a")
}

// Challenge: Define the `bedazzle` function
fn bedazzle(s: &mut String) {
    *s = String::from("sparkly");
}

fn main() {
    // This fancy stuff either gets the first argument as a String, or prints
    // usage and exits if an argument was not supplied to the program.
    let mut arg: String = std::env::args().nth(1).unwrap_or_else(|| {
        println!("Please supply an argument to this program.");
        std::process::exit(-1);
    });

    // 1. Call the `inspect` function
    inspect(&arg);

    // 2. Call the `change` function
    change(&mut arg);
    println!("I have many {}", arg);

    // 3. Call the `eat` function
    if eat(arg) {
        println!("Might be bananas");
    } else {
        println!("Not bananas");
    }

    // Challenge: Call the `bedazzle` function
    let mut material = "mud".to_string();
    println!("This material is just `{}`.", material);
    bedazzle(&mut material);
    println!("Wow! Now the material is `{}`!", material);
}
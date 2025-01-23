#![allow(dead_code, unused_imports, unused_variables)]
use crossbeam::channel;
use std::thread;
use std::time::Duration;

fn expensive_sum(v: Vec<i32>) -> i32 {
    pause_ms(500);
    println!("Child thread: just about finished");
    v.iter()
        .filter(|&x| x % 2 == 0) // Keep only even numbers
        .map(|&x| x * x) // Square the values
        .sum() // Sum the squared even numbers
}

fn pause_ms(ms: u64) {
    thread::sleep(Duration::from_millis(ms));
}

fn main() {
    let my_vector = vec![2, 5, 1, 0, 4, 3];

    // 2. Spawn a child thread
    let handle = thread::spawn(move || expensive_sum(my_vector));

    // Main thread work
    for letter in vec!["a", "b", "c", "d", "e", "f"] {
        println!("Main thread: Letter {}", letter);
        pause_ms(200);
    }

    // 3. Retrieve the value from the child thread
    let sum = handle.join().unwrap();
    println!("The child thread's expensive sum is {}", sum);

    // 4. Uncomment and modify the channel example
    let (tx, rx) = channel::unbounded();
    let tx2 = tx.clone();

    let handle_a = thread::spawn(move || {
        pause_ms(300); // Delay Thread A
        tx2.send("Thread A: 1").unwrap();
        pause_ms(200);
        tx2.send("Thread A: 2").unwrap();
    });

    pause_ms(100); // Ensure Thread B starts first

    let handle_b = thread::spawn(move || {
        pause_ms(0); // No delay for Thread B
        tx.send("Thread B: 1").unwrap();
        pause_ms(200);
        tx.send("Thread B: 2").unwrap();
    });

    for msg in rx {
        println!("Main thread: Received {}", msg);
    }

    handle_a.join().unwrap();
    handle_b.join().unwrap();

    // Challenge: Two child threads with channels
    let (tx, rx) = channel::unbounded();
    let rx2 = rx.clone();

    let handle1 = thread::spawn(move || {
        for msg in rx {
            println!("Child thread 1: Received {}", msg);
        }
    });

    let handle2 = thread::spawn(move || {
        for msg in rx2 {
            println!("Child thread 2: Received {}", msg);
        }
    });

    for i in 0..5 {
        println!("Main thread: Sending {}", i);
        tx.send(i).unwrap();
        pause_ms(100);
    }

    drop(tx); // Close the sending side

    handle1.join().unwrap();
    handle2.join().unwrap();

    println!("Main thread: Exiting.")
}
#![allow(dead_code, unused_variables)]

use image::{DynamicImage, GenericImageView, ImageBuffer, Rgb};
use std::env;

fn main() {
    let mut args: Vec<String> = env::args().skip(1).collect();
    if args.is_empty() {
        print_usage_and_exit();
    }

    let subcommand = args.remove(0);
    match subcommand.as_str() {
        "blur" => {
            if args.len() != 3 {
                print_usage_and_exit();
            }
            let infile = args.remove(0);
            let outfile = args.remove(0);
            let blur_amount: f32 = args.remove(0).parse().expect("Failed to parse blur amount");
            blur(infile, outfile, blur_amount);
        }

        "brighten" => {
            if args.len() != 3 {
                print_usage_and_exit();
            }
            let infile = args.remove(0);
            let outfile = args.remove(0);
            let brightness: i32 = args.remove(0).parse().expect("Failed to parse brightness");
            brighten(infile, outfile, brightness);
        }

        "crop" => {
            if args.len() != 6 {
                print_usage_and_exit();
            }
            let infile = args.remove(0);
            let outfile = args.remove(0);
            let x: u32 = args.remove(0).parse().expect("Failed to parse x");
            let y: u32 = args.remove(0).parse().expect("Failed to parse y");
            let width: u32 = args.remove(0).parse().expect("Failed to parse width");
            let height: u32 = args.remove(0).parse().expect("Failed to parse height");
            crop(infile, outfile, x, y, width, height);
        }

        "rotate" => {
            if args.len() != 3 {
                print_usage_and_exit();
            }
            let infile = args.remove(0);
            let outfile = args.remove(0);
            let degrees: u32 = args.remove(0).parse().expect("Failed to parse degrees");
            rotate(infile, outfile, degrees);
        }

        "invert" => {
            if args.len() != 2 {
                print_usage_and_exit();
            }
            let infile = args.remove(0);
            let outfile = args.remove(0);
            invert(infile, outfile);
        }

        "grayscale" => {
            if args.len() != 2 {
                print_usage_and_exit();
            }
            let infile = args.remove(0);
            let outfile = args.remove(0);
            grayscale(infile, outfile);
        }

        "generate" => {
            if args.len() != 6 {
                print_usage_and_exit();
            }
            let outfile = args.remove(0);
            let width: u32 = args.remove(0).parse().expect("Failed to parse width");
            let height: u32 = args.remove(0).parse().expect("Failed to parse height");
            let red: u8 = args.remove(0).parse().expect("Failed to parse red");
            let green: u8 = args.remove(0).parse().expect("Failed to parse green");
            let blue: u8 = args.remove(0).parse().expect("Failed to parse blue");
            generate(outfile, width, height, red, green, blue);
        }

        "fractal" => {
            if args.len() != 1 {
                print_usage_and_exit();
            }
            let outfile = args.remove(0);
            fractal(outfile);
        }

        _ => {
            print_usage_and_exit();
        }
    }
}

fn print_usage_and_exit() {
    println!("USAGE:");
    println!("blur INFILE OUTFILE BLUR_AMOUNT");
    println!("brighten INFILE OUTFILE BRIGHTNESS");
    println!("crop INFILE OUTFILE X Y WIDTH HEIGHT");
    println!("rotate INFILE OUTFILE DEGREES");
    println!("invert INFILE OUTFILE");
    println!("grayscale INFILE OUTFILE");
    println!("generate OUTFILE WIDTH HEIGHT RED GREEN BLUE");
    println!("fractal OUTFILE");
    std::process::exit(-1);
}

fn blur(infile: String, outfile: String, blur_amount: f32) {
    let img = image::open(infile).expect("Failed to open INFILE.");
    let img2 = img.blur(blur_amount);
    img2.save(outfile).expect("Failed writing OUTFILE.");
}

fn brighten(infile: String, outfile: String, brightness: i32) {
    let img = image::open(infile).expect("Failed to open INFILE.");
    let img2 = img.brighten(brightness);
    img2.save(outfile).expect("Failed writing OUTFILE.");
}

fn crop(infile: String, outfile: String, x: u32, y: u32, width: u32, height: u32) {
    let mut img = image::open(infile).expect("Failed to open INFILE.");
    let img2 = img.crop(x, y, width, height);
    img2.save(outfile).expect("Failed writing OUTFILE.");
}

fn rotate(infile: String, outfile: String, degrees: u32) {
    let img = image::open(infile).expect("Failed to open INFILE.");
    let img2 = match degrees {
        90 => img.rotate90(),
        180 => img.rotate180(),
        270 => img.rotate270(),
        _ => panic!("Invalid rotation degree. Use 90, 180, or 270."),
    };
    img2.save(outfile).expect("Failed writing OUTFILE.");
}

fn invert(infile: String, outfile: String) {
    let mut img = image::open(infile).expect("Failed to open INFILE.");
    img.invert();
    img.save(outfile).expect("Failed writing OUTFILE.");
}

fn grayscale(infile: String, outfile: String) {
    let img = image::open(infile).expect("Failed to open INFILE.");
    let img2 = img.grayscale();
    img2.save(outfile).expect("Failed writing OUTFILE.");
}

fn generate(outfile: String, width: u32, height: u32, red: u8, green: u8, blue: u8) {
    let mut imgbuf = ImageBuffer::new(width, height);
    for (_, _, pixel) in imgbuf.enumerate_pixels_mut() {
        *pixel = Rgb([red, green, blue]);
    }
    imgbuf.save(outfile).expect("Failed writing OUTFILE.");
}

fn fractal(outfile: String) {
    let width = 800;
    let height = 800;

    let mut imgbuf = ImageBuffer::new(width, height);

    let scale_x = 3.0 / width as f32;
    let scale_y = 3.0 / height as f32;

    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let red = (0.3 * x as f32) as u8;
        let blue = (0.3 * y as f32) as u8;

        let cx = y as f32 * scale_x - 1.5;
        let cy = x as f32 * scale_y - 1.5;

        let c = num_complex::Complex::new(-0.4, 0.6);
        let mut z = num_complex::Complex::new(cx, cy);

        let mut green = 0;
        while green < 255 && z.norm() <= 2.0 {
            z = z * z + c;
            green += 1;
        }

        *pixel = Rgb([red, green, blue]);
    }

    imgbuf.save(outfile).unwrap();
}
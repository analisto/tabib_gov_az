### Updated `README.md`

```markdown
# Rust Image Processing Application

This is a command-line image processing application written in Rust. It supports various operations such as blurring, brightening, cropping, rotating, inverting, grayscale conversion, generating solid color images, and creating fractal images.

## Features

- **Blur**: Apply a blur effect to an image.
- **Brighten**: Adjust the brightness of an image.
- **Crop**: Crop an image to a specified rectangle.
- **Rotate**: Rotate an image by 90, 180, or 270 degrees.
- **Invert**: Invert the colors of an image.
- **Grayscale**: Convert an image to grayscale.
- **Generate**: Create a solid color image.
- **Fractal**: Generate a fractal image.

## Usage

Run the program with the following commands:

```bash
cargo run --release blur INFILE OUTFILE BLUR_AMOUNT
cargo run --release brighten INFILE OUTFILE BRIGHTNESS
cargo run --release crop INFILE OUTFILE X Y WIDTH HEIGHT
cargo run --release rotate INFILE OUTFILE DEGREES
cargo run --release invert INFILE OUTFILE
cargo run --release grayscale INFILE OUTFILE
cargo run --release generate OUTFILE WIDTH HEIGHT RED GREEN BLUE
cargo run --release fractal OUTFILE
```

## Certificate

This certificate above verifies that **Ismat Samadov** successfully completed the course **Ultimate Rust Crash Course** on **01/22/2025** as taught by **Nathan Stocks** on **Udemy**. The certificate indicates the entire course was completed as validated by the student. The course duration represents the total video hours of the course at the time of the most recent completion.

![Udemy Certificate](https://udemy-certificate.s3.amazonaws.com/image/UC-6dc9148c-8557-41ec-b3e4-d055492e520b.jpg)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

---

### Key Changes
1. **Added Certificate Section**:
   - Added a section to display the certificate image and the verification text.
2. **Image Embedding**:
   - Used the `![Udemy Certificate](URL)` syntax to embed the image in the `README.md`.

---

### How It Looks
When you view the `README.md` on GitHub or any Markdown viewer, it will display the certificate image along with the verification text.

---

Let me know if you need further assistance! 😊
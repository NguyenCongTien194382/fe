// SolidTemplate.js
import React, { useEffect } from 'react';
import anime from 'animejs';
import ScrollReveal from 'scrollreveal';

const SolidTemplate = () => {

  useEffect(() => {
    // Thực hiện các công việc cần thiết khi component được mount

    // Sử dụng animejs
    anime({
      targets: '.hero-figure-box',
      translateX: [0, 100],
      easing: 'easeInOutQuad',
      duration: 1000,
      loop: true,
      direction: 'alternate'
    });

    // Sử dụng scrollreveal
    ScrollReveal().reveal('.anime-element', {
      duration: 1000,
      delay: 200,
      origin: 'bottom',
      distance: '50px',
      easing: 'ease-out',
      reset: true
    });

    // Cleanup khi component unmount (nếu cần)
    return () => {
      // Cleanup code (nếu có)
    };
  }, []); // Chú ý: useEffect sẽ chỉ chạy một lần khi component được mount (do truyền mảng rỗng [])


  return (
    <>
      {/* Paste the HTML content here */}
      <html lang="en" className="no-js">
        <head>
          {/* Head content */}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Solid Template</title>
          <link
            href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="dist/css/style.css" />
          <script src="https://unpkg.com/animejs@3.0.1/lib/anime.min.js"></script>
          <script src="https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js"></script>
        </head>
        <body className="is-boxed has-animations">
          {/* Body content */}
          <div className="body-wrap">
            <header className="site-header">
              <div className="container">
                <div className="site-header-inner">
                  <div className="brand header-brand">
                    <h1 className="m-0">
                      
                        <img
                          className="header-logo-image"
                          src="dist/images/logo.svg"
                          alt="Logo"
                        />
                      
                    </h1>
                  </div>
                </div>
              </div>
            </header>

            <main>
              <section className="hero">
                <div className="container">
                  <div className="hero-inner">
                    <div className="hero-copy">
                      <h1 className="hero-title mt-0">Chào mừng bạn đến với thế giới của chúng tôi -- Chat BKA</h1>
                      <p className="hero-paragraph">
                        Chat BKA -- Kết nối với thế giới trong khả năng của bạn
                      </p>
                      <div className="hero-cta">
                        <a className="button button-primary" href="/login">
                          Đăng nhập
                        </a>
                        <a className="button" href="/register">
                          Đăng ký
                        </a>
                      </div>
                    </div>
                    <div className="hero-figure anime-element">
                      <svg
                        className="placeholder"
                        width="528"
                        height="396"
                        viewBox="0 0 528 396"
                      >
                      </svg>
                      <div class="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
                      <div class="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
                      <div class="hero-figure-box hero-figure-box-03" data-rotation="0deg"></div>
                      <div class="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
                      <div class="hero-figure-box hero-figure-box-05"></div>
                      <div class="hero-figure-box hero-figure-box-06"></div>
                      <div class="hero-figure-box hero-figure-box-07"></div>
                      <div class="hero-figure-box hero-figure-box-08" data-rotation="-22deg"></div>
                      <div class="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
                      <div class="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>

          <script src="dist/js/main.min.js"></script>
        </body>
      </html>
    </>
  );
};

export default SolidTemplate;

import React from 'react';
import Container from 'react-bootstrap/Container';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-4 py-4"> 
            <Container className="text-center">
                <p className="mb-1 small">
                    Developed in Milan 2025 for an Epicode part time project. All rights Reserved.
                </p>
                <p className="mb-0">
                  <span>  <a 
                        href="https://www.linkedin.com/in/lukas-weber-159057115/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="me-1 text-info text-decoration-none fw-bold"
                    >
                        About Me 
                    </a>
                    </span>
                     <span className="fst-italic me-1">and</span>
                    <span>
                    <a 
                        href="https://github.com/LukElvetico" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-info text-decoration-none fw-bold"
                    >
                        my Portfolio
                    </a>
                    </span>
                </p>
            </Container>
        </footer>
    );
}

export default Footer;
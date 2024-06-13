# User-Service Microservice

This microservice is built using NestJS and Docker. It provides functionality for managing users, roles, authentication, Twilio integration for SMS services, and cryptographic operations.


## Features

- **Authentication Module**: Handles user authentication and authorization.
- **User Module**: Manages user data, including CRUD operations.
- **Twilio Service**: Integration with Twilio for SMS services.
- **Crypto Service**: Provides cryptographic operations for secure data handling.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (if running outside Docker)
- [NestJS CLI](https://nestjs.com/) (if running outside Docker)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/user-service.git
    cd user-service
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file based on the `.env.example` template.

2. Update the configuration variables in the `.env` file as needed.

### Running the Microservice

#### Using Docker


1. Run the Docker container:

    ```bash
    docker compose up --build
    ```

#### Locally (without Docker)

1. Start the application:

    ```bash
    npm run start:dev
    ```

### Usage

The microservice exposes various endpoints for managing users, roles, and authentication. Here are some common endpoints:

- **User Endpoints**:
  - `GET /api/v1/user/`: Get users.
  - `POST /api/v1/user/create`: Create a new user.
  - `POST /api/v1/user/kyc/`: Update a user's Kyc.
  - `POST /api/v1/user/role`: Update a user's role.



- **Authentication Endpoints**:
  - `POST /api/v1/auth/send-otp`: Send Otp.
  - `POST /api/v1/auth/resend-otp`: Resend Otp.
  - `POST /api/v1/auth/verify-otp`: Verify Otp.
  - `POST /api/v1/auth/create-mpin`: Create MPIN.
  - `PUT /api/v1/auth/verify-mpin`: Verify MPIN.

[Postman documentation for reference](https://documenter.getpostman.com/view/32751383/2sA35LVz62)


## Branching Strategy

To maintain a clear and organized workflow, we use the following branching strategy:

1. **Feature Branches**

   - For new features:
   - Format: `feature/brief-description`
   - Example: `feature/user-authentication`, `feature/shopping-cart`

2. **Bugfix Branches**

   - For fixing bugs:
   - Format: `bugfix/brief-description`
   - Example: `bugfix/login-error`, `bugfix/cart-not-updating`

3. **Hotfix Branches**

   - For urgent fixes that need to be deployed immediately:
   - Format: `hotfix/brief-description`
   - Example: `hotfix/critical-security-patch`, `hotfix/payment-gateway`

4. **Improvement Branches**

   - For improvements or refactoring that aren't new features:
   - Format: `improvement/brief-description`
   - Example: `improvement/code-refactor`, `improvement/ui-enhancements`

5. **Release Branches**

   - For preparing a release:
   - Format: `release/version-number`
   - Example: `release/1.0.0`, `release/2.1.3`

6. **Experiment Branches**

   - For experimental features or spikes:
   - Format: `experiment/brief-description`
   - Example: `experiment/new-ui-concept`, `experiment/performance-tuning`

7. **Chore Branches**
   - For routine tasks such as updating dependencies or documentation:
   - Format: `chore/brief-description`
   - Example: `chore/update-dependencies`, `chore/add-documentation`


### Contributing

Contributions are welcome! If you'd like to contribute to this microservice, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

### License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize the README according to your specific project structure and requirements. You can add more detailed instructions, examples, or usage guidelines as needed.

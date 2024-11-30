
# Elytra: AI-Powered Video Chatbot for Student Counseling  

Elytra is an AI-powered video chatbot designed to guide and counsel students who are aspiring to study abroad. By integrating cutting-edge AI technologies and real-time video chat capabilities, Elytra offers personalized, real-time counseling, making the journey to studying abroad much smoother.

---

## Features  

- **AI-Powered Counseling**: Integrated with OpenAI’s generative AI for personalized advice and responses.
- **Real-Time Video Interaction**: LiveKit is used to enable seamless video chat between the student and counselor.
- **Secure Authentication**: Integrated with NextAuth and Prisma for a robust and secure user authentication system.
- **Data Storage**: Using Pinecone for efficient vector-based data storage.
- **Customizable UI**: Tailored design using Radix-UI components and Tailwind CSS.
- **Automated Communication**: Email functionality powered by Nodemailer for notifications.
  
---

## Tech Stack  

- **Frontend**: [Next.js](https://nextjs.org), Tailwind CSS, Radix-UI components
- **Backend**: Prisma ORM, Pinecone, NextAuth, LiveKit
- **AI & APIs**: OpenAI, Google Generative AI, Pinecone
- **Utilities**: Zod for input validation, Axios for API calls, Formik for forms, and Framer Motion for animations
- **Dev Tools**: TypeScript, Husky, ESLint, Prettier  

---

## Getting Started  

To get this project running on your local machine, follow the instructions below.

### Prerequisites  

Make sure the following software is installed:  

- Node.js >= 16  
- npm, yarn, pnpm, or bun  
- Prisma CLI: `npm install -g prisma`

### Installation  

1. Clone the repository:  

   ```bash  
   git clone https://github.com/your-repo/elytra.git  
   cd elytra  
   ```

2. Install dependencies:  

   ```bash  
   npm install  
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory of the project with the following example variables:  

   ```env  
   GOOGLE_CLIENT_ID=  
   GOOGLE_CLIENT_SECRET=  
   GITHUB_CLIENT_ID=  
   GITHUB_CLIENT_SECRET=  
   NEXT_SECRET=  
   DATABASE_URL=  
   NEXT_PUBLIC_ADMIN_EMAIL=  
   NEXT_PUBLIC_ADMIN_PASSWORD=  
   NEXT_PUBLIC_JWT_SECRET=  
   LIVEKIT_API_KEY=  
   LIVEKIT_API_SECRET=  
   LIVEKIT_URL=  
   NEXT_PUBLIC_PINECONE_API_KEY=  
   NEXT_PUBLIC_GEMINI_API_KEY=  
   OPENAI_API_KEY=  
   NEXT_PUBLIC_NODEMAILER_PASS=  
   NEXT_PUBLIC_MAIL_ADD=  
   ```

   Replace the placeholder values with your actual credentials for services like Google OAuth, GitHub OAuth, LiveKit, Pinecone, and OpenAI.

4. Run Prisma commands to set up your database:

   - Pull the schema from the database (if you have an existing schema):
     ```bash
     npx prisma db pull
     ```

   - Run migrations (for any changes to your schema):
     ```bash
     npx prisma migrate dev
     ```

   - Generate the Prisma client:
     ```bash
     npx prisma generate
     ```

5. Run the development server:

   ```bash
   npm run dev
   ```

   This will start the Next.js development server, which you can view at [http://localhost:3000](http://localhost:3000).

---

## Docker Setup  

To run Elytra using Docker, follow these steps to ensure that your environment is properly configured.

### Prerequisites

Before running Elytra in Docker, make sure you have the following installed:

- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose** (optional but recommended for multi-container setups)

### Running Elytra with Docker

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone https://github.com/your-repo/elytra.git
   cd elytra
   ```

2. Build the Docker image:

   ```bash
   docker build -t elytra .
   ```

3. Create a `.env` file in the root of the project (if not already done). This should contain your environment variables for the services you are using (e.g., OpenAI API key, Google OAuth credentials, etc.).

   Example `.env` file:

   ```env
   GOOGLE_CLIENT_ID=  
   GOOGLE_CLIENT_SECRET=  
   GITHUB_CLIENT_ID=  
   GITHUB_CLIENT_SECRET=  
   NEXT_SECRET=  
   DATABASE_URL=  
   NEXT_PUBLIC_ADMIN_EMAIL=  
   NEXT_PUBLIC_ADMIN_PASSWORD=  
   NEXT_PUBLIC_JWT_SECRET=  
   LIVEKIT_API_KEY=  
   LIVEKIT_API_SECRET=  
   LIVEKIT_URL=  
   NEXT_PUBLIC_PINECONE_API_KEY=  
   NEXT_PUBLIC_GEMINI_API_KEY=  
   OPENAI_API_KEY=  
   NEXT_PUBLIC_NODEMAILER_PASS=  
   NEXT_PUBLIC_MAIL_ADD=  
   ```

4. Run the Docker container:

   ```bash
   docker run --env-file .env -p 3000:3000 elytra
   ```

   This command will start the app, and you can access it in your browser at [http://localhost:3000](http://localhost:3000).

### Accessing the Application

Once the Docker container is running, the application will be accessible on your local machine at `http://localhost:3000`. You can use your browser to interact with the app.

### Stopping the Docker Container

To stop the running container, press `Ctrl+C` in your terminal or use the following command to stop it:

```bash
docker stop <container_id>
```

You can get the `container_id` by running `docker ps` to list all running containers.

---

## Scripts  

The following commands are available:

- `npm run dev` - Starts the development server with TurboPack.
- `npm run build` - Builds the app for production, generating Prisma client and static assets.
- `npm run start` - Starts the production server.
- `npm run start:prisma` - Runs Prisma migrations and generates the Prisma client.
- `npm run lint` - Lints the codebase using ESLint.
- `npm run format` - Formats the code using Prettier.

---

## Prisma Commands  

Here are some common Prisma commands used in this project:

- **Generate Prisma Client**:  
  ```bash  
  npx prisma generate  
  ```

- **Migrate Database**:  
  Run this command whenever you make changes to the database schema:
  ```bash  
  npx prisma migrate dev  
  ```

- **Pull Database Schema**:  
  If you need to sync your Prisma schema with an existing database, run:
  ```bash  
  npx prisma db pull  
  ```

- **Inspect Prisma Schema**:  
  If you want to inspect your Prisma schema file, use the following:
  ```bash  
  npx prisma studio  
  ```

---

## Deployment  

For deployment, we recommend using the [Vercel Platform](https://vercel.com), which is optimized for Next.js apps.

### Steps:

1. Build the app:

   ```bash  
   npm run build  
   ```

2. Deploy the app to Vercel using their CLI or through their dashboard.

   For detailed instructions, visit the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

---

## Learn More  

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)  
- [Prisma Documentation](https://www.prisma.io/docs)  
- [OpenAI Documentation](https://platform.openai.com/docs)  
- [LiveKit Documentation](https://docs.livekit.io/)  
- [Pinecone Documentation](https://www.pinecone.io/docs/)

---

## Contributing  

We welcome contributions to this project! Here's how you can get involved:

1. Fork the repository.
2. Create a feature branch:  
   ```bash  
   git checkout -b feature-name  
   ```
3. Make your changes and commit them:  
   ```bash  
   git commit -m 'Add new feature'  
   ```
4. Push the changes to your fork:  
   ```bash  
   git push origin feature-name  
   ```
5. Create a pull request from your fork to the main repository.

---

## License  

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


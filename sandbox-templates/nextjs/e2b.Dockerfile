# ---- Base image ----
      FROM node:21-slim

      
      RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*
      COPY compile_page.sh /compile_page.sh
      RUN chmod +x /compile_page.sh
      # Install dependencies only when needed
      WORKDIR /home/user/nextjs-app
      RUN npx --yes  create-next-app@latest --yes

      
      
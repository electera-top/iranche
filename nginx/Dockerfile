FROM nginx:alpine

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy admin panel files
COPY ../admin-panel/ /var/www/admin-panel/

# Remove default nginx files
RUN rm -f /usr/share/nginx/html/index.html.default

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

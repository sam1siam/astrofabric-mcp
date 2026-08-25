# The AstroFabric MCP server (stdio), containerized. Missions execute
# through the AstroFabric platform with your key:
#
#   docker build -t astrofabric-mcp .
#   docker run -i --rm -e ASTROFABRIC_API_KEY=ek_live_... astrofabric-mcp

FROM node:22-alpine

WORKDIR /app
COPY package.json server.mjs ./
RUN npm install --omit=dev

ENV ASTROFABRIC_API_KEY=""

CMD ["node", "server.mjs"]

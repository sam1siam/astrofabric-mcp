# Runnable form of the AstroFabric connector, for registries that build and
# inspect servers (Glama releases, sandboxed checks). It is a thin stdio
# bridge to the hosted endpoint - the platform itself stays hosted.
#
# Requires ASTROFABRIC_API_KEY at runtime (never baked into the image):
#   docker run -e ASTROFABRIC_API_KEY=ek_live_... <image>

FROM node:22-alpine

RUN npm install -g mcp-remote@latest

ENV ASTROFABRIC_API_KEY=""

# Shell form so the env var expands at runtime.
CMD npx -y mcp-remote https://www.astrofabric.ai/api/mcp --transport http-only --header "Authorization: Bearer ${ASTROFABRIC_API_KEY}"

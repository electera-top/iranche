#!/bin/sh
set -e

# Fix Docker socket permissions on startup (requires root, so skip if not root)
# Note: This will be done manually or via init script if needed
# Socket should already have 666 permissions from host

# Execute the main command
exec "$@"


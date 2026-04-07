#!/usr/bin/env bash
set -e

# Archon CLI installer
# Usage: curl -fsSL https://usik.github.io/archon/install.sh | bash

REPO="usik/archon"
INSTALL_DIR="$HOME/.archon"
BIN_DIR="$HOME/.local/bin"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
DIM='\033[2m'
RESET='\033[0m'

echo ""
echo "  Installing Archon CLI..."
echo ""

# ── Check dependencies ─────────────────────────────────────────────────────

if ! command -v node &>/dev/null; then
  echo "  ✗ Node.js is required but not installed."
  echo "    Install it from https://nodejs.org (v18+ recommended)"
  exit 1
fi

if ! command -v git &>/dev/null; then
  echo "  ✗ git is required but not installed."
  exit 1
fi

NODE_VERSION=$(node -e "process.stdout.write(process.version.slice(1).split('.')[0])")
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "  ✗ Node.js v18+ is required. You have v$NODE_VERSION."
  exit 1
fi

# ── Clone or update ────────────────────────────────────────────────────────

if [ -d "$INSTALL_DIR" ]; then
  echo "  ${DIM}Updating existing installation...${RESET}"
  git -C "$INSTALL_DIR" pull --quiet origin main
else
  echo "  ${DIM}Cloning archon...${RESET}"
  git clone --quiet https://github.com/$REPO.git "$INSTALL_DIR"
fi

# ── Install dependencies and build ────────────────────────────────────────

cd "$INSTALL_DIR"

echo "  ${DIM}Installing dependencies...${RESET}"
npm install --quiet --no-fund --no-audit 2>/dev/null

echo "  ${DIM}Building CLI...${RESET}"
npm run build --silent 2>/dev/null

# ── Link binary ───────────────────────────────────────────────────────────

mkdir -p "$BIN_DIR"

cat > "$BIN_DIR/archon" <<EOF
#!/usr/bin/env bash
node "$INSTALL_DIR/dist/cli.js" "\$@"
EOF

chmod +x "$BIN_DIR/archon"

# ── Add to PATH if needed ─────────────────────────────────────────────────

SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
  SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
  SHELL_RC="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
  SHELL_RC="$HOME/.bash_profile"
fi

if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  if [ -n "$SHELL_RC" ]; then
    echo "" >> "$SHELL_RC"
    echo "# Archon CLI" >> "$SHELL_RC"
    echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_RC"
    echo "  ${DIM}Added $BIN_DIR to PATH in $SHELL_RC${RESET}"
    echo "  ${DIM}Run: source $SHELL_RC${RESET}"
  else
    echo "  ${DIM}Add this to your shell config:${RESET}"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
  fi
fi

# ── Done ──────────────────────────────────────────────────────────────────

echo ""
echo "  ${GREEN}✓ Archon installed successfully${RESET}"
echo ""
echo "  ${BLUE}Get started:${RESET}"
echo "    archon list                          # browse harnesses"
echo "    archon deploy toss-feature-dev       # deploy a harness"
echo "    archon deploy-package zero-to-market-kr  # deploy a full team"
echo ""
echo "  ${DIM}Docs: https://usik.github.io/archon${RESET}"
echo "  ${DIM}Repo: https://github.com/$REPO${RESET}"
echo ""

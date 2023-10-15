DENDRITE_VERSION="0.13.3"
git clone https://github.com/matrix-org/dendrite --depth 1 --branch v$DENDRITE_VERSION dendrite-upstream
echo "building: linux-arm64"
(cd dendrite-upstream && CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o bin/ ./cmd/...; mkdir -p ../npm/linux-arm64/dist && rm -rf bin/dendrite-demo*; cp bin/* ../npm/linux-arm64/dist/)
rm -rf dendrite-upstream/bin/*
echo "building: linux-x64"
(cd dendrite-upstream && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/ ./cmd/...; mkdir -p ../npm/linux-x64/dist && rm -rf bin/dendrite-demo*; cp bin/* ../npm/linux-x64/dist/)
rm -rf dendrite-upstream/bin/*
echo "building: darwin-arm64"
(cd dendrite-upstream && CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -o bin/ ./cmd/...; mkdir -p ../npm/darwin-arm64/dist && rm -rf bin/dendrite-demo*; cp bin/* ../npm/darwin-arm64/dist/)
rm -rf dendrite-upstream/bin/*
echo "building: darwin-x64"
(cd dendrite-upstream && CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o bin/ ./cmd/...; mkdir -p ../npm/darwin-x64/dist && rm -rf bin/dendrite-demo*; cp bin/* ../npm/darwin-x64/dist/)
rm -rf dendrite-upstream/bin/*
echo "building: win32-x64"
(cd dendrite-upstream && CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o bin/ ./cmd/...; mkdir -p ../npm/win32-x64/dist && rm -rf bin/dendrite-demo*; cp bin/* ../npm/win32-x64/dist/)
rm -rf dendrite-upstream/bin/*
chmod +x ./npm/*/dist/*

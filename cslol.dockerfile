# Use Ubuntu 24.04 (Noble) for modern apt repositories
FROM ubuntu:24.04

# Prevent interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# 1. Install Build Dependencies
# - mingw-w64: Cross-compiler for Windows
# - git, wget: Downloading code and tools
# - ninja-build: Faster build system than make
# - zip, unzip: Required by CMake's FetchContent
RUN apt-get update && apt-get install -y \
    build-essential \
    mingw-w64 \
    git \
    wget \
    ninja-build \
    zip \
    unzip \
    ca-certificates

# 2. Install CMake 3.31 manually (Fixes CMP0169 error)
# We need a version > 3.24, and Ubuntu's default might be older depending on the snapshot
RUN wget https://github.com/Kitware/CMake/releases/download/v3.31.0/cmake-3.31.0-linux-x86_64.sh -O cmake_installer.sh \
    && chmod +x cmake_installer.sh \
    && ./cmake_installer.sh --prefix=/usr/local --skip-license \
    && rm cmake_installer.sh

# 3. Create the Toolchain File (defines MinGW for CMake)
RUN echo 'set(CMAKE_SYSTEM_NAME Windows)' > /toolchain.cmake && \
    echo 'set(CMAKE_SYSTEM_PROCESSOR x86_64)' >> /toolchain.cmake && \
    echo 'set(CMAKE_C_COMPILER x86_64-w64-mingw32-gcc)' >> /toolchain.cmake && \
    echo 'set(CMAKE_CXX_COMPILER x86_64-w64-mingw32-g++)' >> /toolchain.cmake && \
    echo 'set(CMAKE_RC_COMPILER x86_64-w64-mingw32-windres)' >> /toolchain.cmake && \
    echo 'set(CMAKE_FIND_ROOT_PATH /usr/x86_64-w64-mingw32)' >> /toolchain.cmake && \
    echo 'set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)' >> /toolchain.cmake && \
    echo 'set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)' >> /toolchain.cmake && \
    echo 'set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)' >> /toolchain.cmake && \
    echo 'set(CMAKE_C_FLAGS_INIT "-static-libgcc")' >> /toolchain.cmake && \
    echo 'set(CMAKE_CXX_FLAGS_INIT "-static-libgcc -static-libstdc++")' >> /toolchain.cmake && \
    echo 'set(CMAKE_EXE_LINKER_FLAGS_INIT "-static-libgcc -static-libstdc++ -static")' >> /toolchain.cmake

# 4. Create the Build Script inside the image
# We write the script to /build.sh and make it executable
RUN echo '#!/bin/bash' > /build.sh && \
    echo 'set -e' >> /build.sh && \
    echo 'echo "--- CMake Version: $(cmake --version | head -n1) ---"' >> /build.sh && \
    echo 'cd /tmp' >> /build.sh && \
    echo 'echo "--- Cloning Repo ---"' >> /build.sh && \
    echo 'git clone --recursive https://github.com/LeagueToolkit/cslol-manager.git repo' >> /build.sh && \
    echo 'cd repo/cslol-tools' >> /build.sh && \
    echo 'echo "--- Configuring (Windows x64) ---"' >> /build.sh && \
    echo 'cmake -B build -S . -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=/toolchain.cmake' >> /build.sh && \
    echo 'echo "--- Building ---"' >> /build.sh && \
    echo 'cmake --build build --config Release' >> /build.sh && \
    echo 'echo "--- Copying Output ---"' >> /build.sh && \
    echo 'mkdir -p /output' >> /build.sh && \
    echo 'cp build/*.exe /output/' >> /build.sh && \
    echo 'find build -name "*.dll" -exec cp {} /output/ \; 2>/dev/null || true' >> /build.sh && \
    # Copy required MinGW runtime DLLs
    echo 'cp /usr/x86_64-w64-mingw32/bin/libgcc_s_seh-1.dll /output/' >> /build.sh && \
    echo 'cp /usr/x86_64-w64-mingw32/bin/libstdc++-6.dll /output/' >> /build.sh && \
    echo 'cp /usr/x86_64-w64-mingw32/bin/libwinpthread-1.dll /output/' >> /build.sh && \
    # Create config.ini in the same directory as the exes (/output)
    echo 'cat > /output/config.ini <<'\''EOF'\'' ' >> /build.sh && \
    echo '[General]' >> /build.sh && \
    echo 'ignorebad=false' >> /build.sh && \
    echo 'themeAccentColor=1' >> /build.sh && \
    echo 'lastZipDirectory=@Variant(\0\0\0\x11\xff\xff\xff\xff)' >> /build.sh && \
    echo 'themePrimaryColor=4' >> /build.sh && \
    echo 'windowWidth=640' >> /build.sh && \
    echo 'blacklist=true' >> /build.sh && \
    echo 'suppressInstallConflicts=false' >> /build.sh && \
    echo 'enableAutoRun=false' >> /build.sh && \
    echo 'enableSystray=false' >> /build.sh && \
    echo 'themeDarkMode=true' >> /build.sh && \
    echo 'windowHeight=640' >> /build.sh && \
    echo 'verbosePatcher=false' >> /build.sh && \
    echo 'detectGamePath=true' >> /build.sh && \
    echo 'windowMaximised=false' >> /build.sh && \
    echo 'enableUpdates=0' >> /build.sh && \
    echo 'removeUnknownNames=true' >> /build.sh && \
    echo 'lastUpdateUTCMinutes=29039901' >> /build.sh && \
    echo 'EOF' >> /build.sh && \
    \
    echo 'echo "--- Done! ---"' >> /build.sh && \
    chmod +x /build.sh

# 5. Set the entrypoint to run the script we just created
ENTRYPOINT ["/build.sh"]

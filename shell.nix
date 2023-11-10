# the last successful build of nixos-23.05 (stable) as of 2023-11-10
with import
  (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/41de143fda10e33be0f47eab2bfe08a50f234267.tar.gz";
    sha256 = "1xd9k5nv7i42wabrbv51hbbl81llmgijzqlargag2c40hsx1s276";
  })
{ };

stdenv.mkDerivation {
  name = "trezor-omni-dev";
  buildInputs = [
    nodejs_20
  ];
  shellHook = ''
    export PATH="$PATH:$(pwd)/node_modules/.bin"
  '';
}

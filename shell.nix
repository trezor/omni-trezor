# the last successful build of nixos-20.09 (stable) as of 2020-10-11
with import
  (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/9957cd48326fe8dbd52fdc50dd2502307f188b0d.tar.gz";
    sha256 = "1l2hq1n1jl2l64fdcpq3jrfphaz10sd1cpsax3xdya0xgsncgcsi";
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

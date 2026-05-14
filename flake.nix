{
  description = "tofua";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    codex-cli-nix.url = "github:sadjow/codex-cli-nix";
  };

  outputs =
    { nixpkgs, codex-cli-nix, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          git
          gh
          nodejs
          pnpm
          opencode
        ];
        buildInputs = [
          codex-cli-nix.packages.${system}.default
        ];
      };

      formatter.${system} = pkgs.nixfmt;
    };
}

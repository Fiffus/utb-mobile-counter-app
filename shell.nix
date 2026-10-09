{ pkgs ? import <nixpkgs> { config.allowUnfree = true; }}:

pkgs.mkShell {
	allowUnfree = true;
	buildInputs = with pkgs; [
		android-studio
		ionic-cli
	];

	shellHook = ''
		echo "Entered nix shell with android studio and ionic-cli"
	'';
}

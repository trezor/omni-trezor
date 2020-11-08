# OMNI Wallet for Trezor

This project aims to provide Trezor Hardware Wallet owners with an easy way of creating OMNI layer transactions with their device's Bitcoin accounts.

## Usage

To use this tool, simply go to [https://trezor.github.io/omni-trezor](https://trezor.github.io/omni-trezor) and follow the steps.

As of this version, there are a few things to keep in mind:

* Only Simple Send operations are currently supported
* Send addresses must have at least one OMNI asset as well as at least one unspent Bitcoin output greater than or equal to 8000 Satoshi (0.00008 BTC).
* Key data throughout the transaction process are logged to the Javascript console.

## Development & Contributing

Pull Requests are welcome.  This tool was created using `create-react-app`, please follow those conventions.  As of this version, vanilla React is used without any router, etc.

To run a development environment:
1. `git clone git@github.com:trezor/omni-trezor.git`
2. `npm install`
3. `npm start`

Some ToDos:
* Improve error handling and feedback
* Implement router / routes
* Additional OMNI operation types?
* Improved UX?

## License

© 2019 Tektite Software LLC

This project is licensed under the MIT License.  The full text of this license can be read in LICENSE.md and TERMS.md.

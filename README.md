# sinan-2018
Bitpay interview question, a Vanilla NodeJS server/client combo for key exchanges and verification. Ive included dummy server_cert's for directory structure verbosity.

# USAGE
	
Depending on the arguments passed the script behaves differently.

	export MY_PRIVATE_KEY=$(cat server_cert/snn2_prv.pem)
	export MY_PUBLIC_KEY=$(cat server_cert/snn2_pub.pem)

	node server.js

## On another terminal instance

password triggers public key save, export or argument is necessary

	node client.js user=snn2 password=kalem2  

checks the actual message with the signed message from the server

	node client.js user=snn2 sign=N4zx774PE...fZnOCsg== actual='yello'

assumes private key set on env variable and signs the message

	node client.js user=snn2 message='yello' passphrase=hunter2

	node client.js user=snn2 password=kalem2 production=true  # certificate authority check enforced.

# To generate private and public key pairs along with the csr
	openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
	openssl rsa -in server.key -outform PEM -pubout -out server_pub.pem

## Create the Cert and Sign it

### for dev environment common name must be localhost
	openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt


# Make sure to place the certificates in the trusted certificates directory 
	mv server.key server_cert/server.key
	mv server.crt server_cert/server.crt
	rm csr.pem

### for ubuntu 18.04
	sudo cp server.crt /usr/local/share/ca-certificates/.
	sudo update-ca-certificates

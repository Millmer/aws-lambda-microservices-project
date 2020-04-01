#! /bin/sh
# POSIX

service=

# Usage info
show_help() {
cat << EOF
Usage: [-h] [-s SERVICE]
Install node modules for provided ready to deploy
    -h || --help                     Display this help and exit
    -l || --service SERVICE          Select service to install
EOF
}

# Helpful die function
die() {
    printf '%s\n' "$1" >&2
    exit 1
}

while :; do
    case $1 in
        -h|-\?|--help)
            show_help
            exit
            ;;
        -s|--service)
            if [ "$2" ]; then
                service=$2
                shift
            else
                die 'ERROR: "-l || --service" requires a non-empty option argument.'
            fi
            ;;
        *) break
    esac
    shift
done

# if --service was provided, install that service, else error (in future, install all?)
if [ "$service" ]; then
    echo "Installing global modules"
    npm install
    echo "Installing $service"
    cd services
    if [ -d "$service" ]; then
        echo "$service directory found, installing..."
        cd "${service}"/ && npm install
        echo "Installation complete."
        exit
    else
        die "ERROR: Service $service not found."
    fi
else
    die "ERROR: Service required."
fi
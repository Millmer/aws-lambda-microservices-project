#! /bin/sh
# POSIX

service=
profile='your-profile'
stage='dev'

# Usage info
show_help() {
cat << EOF
Usage: [-h] [-l SERVICE] [-a PROFILE] [-s STAGE]...
Deploy provided SERVICE via serverless
    -h || --help                     Display this help and exit
    -l || --service SERVICE          Select service (lambda) to deploy
    -a || --aws-profile PROFILE      AWS Profile to use for deployment, default tessadev
    -s || --stage STAGE              Stage to deploy, default dev
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
        -l|--service)
            if [ "$2" ]; then
                service=$2
                shift
            else
                die 'ERROR: "-l || --service" requires a non-empty option argument.'
            fi
            ;;
        -a|--aws-profile)
            if [ "$2" ]; then
                profile=$2
                shift
            else
                die 'ERROR: "-a || --aws-profile" requires a non-empty option argument.'
            fi
            ;;
        -s|--stage)
            if [ "$2" ]; then
                stage=$2
                shift
            else
                die 'ERROR: "-s || --stage" requires a non-empty option argument.'
            fi
            ;;
        *) break
    esac
    shift
done

# deploy services
cd services

# if --service was provided, deploy that service, else error (in future, deploy all?)
if [ "$service" ]; then
    echo "Deploying $service"
    if [ -d "$service" ]; then
        echo "$service directory found, deploying..."
        cd "${service}"/ && serverless deploy --aws-profile $profile --stage $stage
        echo "Deployment complete."
        exit
    else
        die "ERROR: Service $service not found."
    fi
else
    die "ERROR: Service required."
fi
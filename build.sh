#!/bin/bash
# POSIX

############################ FILES ############################
# diff - input of CodeBuild, change list of modified services
# logs - contains all install and serverless deploy logs
# successfullyDeployed - set of successfully deployed services, used by rollback
############################ PARAMETERS ############################

service=
stage='dev'

############################ FUNCTIONS ############################

# Usage info
show_help() {
cat << EOF
Usage: [-h] [-s STAGE]...
Deploy provided SERVICE via serverless
    -h || --help                     Display this help and exit
    -s || --stage STAGE              Stage to deploy, default dev
EOF
}

# Helpful die function
die() {
    printf '%s\n' "$1" >&2
    exit 1
}

installAndDeploy () {
    echo ***InstallAndDeploy
    echo ***Install $service dependecies
    sh install.sh --service $service
    echo ***Deploy $service
    cd services/${service}/ && ./../../node_modules/serverless/bin/serverless deploy --stage $stage
    cd ../../
}

orchestrateDeployment() {
    echo ***OrchestrateDeployment

    if cat diff | grep -m 1 -e 'services/api-test-service' -e 'libs'; then
        service="api-test-service"
        installAndDeploy > logs
        validateLogs
        echo $service >> successfullyDeployed
    fi

    if cat diff | grep -m 1 -e 'services/auth-service' -e 'libs'; then
        service="auth-service"
        installAndDeploy > logs
        validateLogs
        echo $service >> successfullyDeployed
    fi

    if cat diff | grep -m 1 -e 'services/elastic-service' -e 'libs'; then
        service="elastic-service"
        installAndDeploy > logs
        validateLogs
        echo $service >> successfullyDeployed
    fi

    if cat diff | grep -m 1 -e 'services/lists-service' -e 'libs'; then
        service="lists-service"
        installAndDeploy > logs
        validateLogs
        echo $service >> successfullyDeployed
    fi

    if cat diff | grep -m 1 -e 'services/users-service' -e 'libs'; then
        service="users-service"
        installAndDeploy > logs
        validateLogs
        echo $service >> successfullyDeployed
    fi

    if cat diff | grep -m 1 -e 'services/stats-service' -e 'libs'; then
        service="stats-service"
        installAndDeploy > logs
        validateLogs
        echo $service >> successfullyDeployed
    fi

    test > logs
    validateLogs
}

validateLogs() {
    cat logs
    echo ***ValidateLogs
    if cat logs | grep -i -e 'error'; then
        echo ***Error found
        rollback
    fi
}

rollback() {
    echo ***Rollback
    while IFS= read -r line; do
        cd services/${line}/
        build=$(./../../node_modules/serverless/bin/serverless deploy list | grep 'Timestamp*' | tail -1 | sed 's/[^0-9]*//g')
        ./../../node_modules/serverless/bin/serverless rollback -t $build
        echo ***Rollbacked service $line with timestamp $build
        cd ../../
    done < successfullyDeployed
    exit 1
}

test() {
    echo ***Test
    cd services/api-test-service/ && ./../../node_modules/serverless/bin/serverless invoke --f test --stage $stage
    ./../../node_modules/serverless/bin/serverless logs -f test
    cd ../../
}

############################ MAIN ############################

while :; do
    case $1 in
        -h|-\?|--help)
            show_help
            exit
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

orchestrateDeployment


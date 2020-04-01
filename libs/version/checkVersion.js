'use strict';

module.exports.compareVersion = async (minVersion, currentVersion = '') => {
    const currentVersionSplit = currentVersion.split('.');
    const minRequiredVersionSplit = minVersion.split('.');

    if (currentVersionSplit.length >= 2) {
        const minMajor = minRequiredVersionSplit[0];
        const minMinor = minRequiredVersionSplit[1];
        const currentMajor = currentVersionSplit[0];
        const currentMinor = currentVersionSplit[1];

        if (currentMinor >= minMinor && currentMajor >= minMajor) {
            console.info('Supported version');
            return true;
        }
    }

    console.warn('Version is marked as deprecated');
    return false;
}
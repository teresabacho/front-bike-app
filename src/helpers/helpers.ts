const formatDistance = (meters) => {
    if (!meters && meters !== 0) return 'інформація не вказана';

    const km = meters / 1000;

    if (km < 1) {
        return `${Math.round(meters)} м`;
    } else if (km < 10) {
        return `${km.toFixed(1)} км`;
    } else {
        return `${Math.round(km)} км`;
    }
};

const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return 'інформація не вказана';

    const minutes = Math.floor(seconds / 60) % 60;
    const hours = Math.floor(seconds / 3600);

    if (hours === 0) {
        return `${minutes} хв`;
    } else {
        return `${hours} год ${minutes > 0 ? minutes + ' хв' : ''}`;
    }
};

export { formatDistance, formatDuration };

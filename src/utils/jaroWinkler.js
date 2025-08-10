window.JaroWinkler = {
  similarity(s1, s2) {
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;

    let m = 0;
    const s1_len = s1.length;
    const s2_len = s2.length;
    const max_dist = Math.floor(Math.max(s1_len, s2_len) / 2) - 1;

    const s1_matches = new Array(s1_len).fill(false);
    const s2_matches = new Array(s2_len).fill(false);

    for (let i = 0; i < s1_len; i++) {
        const start = Math.max(0, i - max_dist);
        const end = Math.min(i + max_dist + 1, s2_len);

        for (let j = start; j < end; j++) {
            if (!s2_matches[j] && s1[i] === s2[j]) {
                s1_matches[i] = true;
                s2_matches[j] = true;
                m++;
                break;
            }
        }
    }

    if (m === 0) return 0.0;

    let k = 0;
    let t = 0;
    for (let i = 0; i < s1_len; i++) {
        if (s1_matches[i]) {
            while (!s2_matches[k]) k++;
            if (s1[i] !== s2[k]) t++;
            k++;
        }
    }
    t /= 2;

    const jaro = (m / s1_len + m / s2_len + (m - t) / m) / 3;

    if (jaro < 0.7) return jaro;

    let l = 0;
    const p = 0.1;
    while (s1[l] === s2[l] && l < 4) l++;

    return jaro + l * p * (1 - jaro);
  }
};
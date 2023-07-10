export default (
    method: string,
    token: string,
    body: string
    ): RequestInit => {
    return {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: body
    }
}


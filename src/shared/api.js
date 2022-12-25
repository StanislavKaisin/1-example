class Api {
  url = "http://localhost:3001";
  async performRequest(url, method = "GET", body) {
    // console.log(url);
    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-type": "application/json",
      }),
    });
    // console.log(response);
    return response.json();
  }
  async getMe() {
    // console.log(this);
    return await this.performRequest(`${this.url}/me`);
  }
  async getPosts() {
    return await this.performRequest(`${this.url}/posts`);
  }
  async addPost(data) {
    return await this.performRequest(`${this.url}/posts`, "POST", data);
  }
  async removePost(id) {
    return await this.performRequest(`${this.url}/posts/${id}`, "DELETE");
  }
}

export default new Api();

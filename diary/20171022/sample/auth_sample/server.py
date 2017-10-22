from flask import Flask, request, redirect, url_for

app = Flask(__name__)

logged_in = False

LOGIN_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <form method="POST" action="">
    <input type="text" name="username">
    <input type="password" name="password">
    <input type="submit" value="submit">
  </form>
</body>
</html>
"""

@app.route("/")
def index():
    return "hello world"

@app.route("/two")
def two():
    return "two"

@app.route("/login", methods=["GET", "POST"])
def login():
    global logged_in
    if logged_in:
        return redirect(url_for("mypage"))
    if request.method == "GET":
        return LOGIN_TEMPLATE
    if not request.form.get("username") or not request.form.get("password"):
        return LOGIN_TEMPLATE
    logged_in = True
    return "logged in"

@app.route("/mypage")
def mypage():
    global logged_in
    if not logged_in:
        return redirect(url_for("login"))
    return "mypage"

@app.route("/logout")
def logout():
    global logged_in
    if not logged_in:
        return redirect(url_for("login"))
    logged_in = False
    return "logout"

def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()


from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key"   # session ke liye zaroori hai

# Dummy user database (later tum ise real DB se replace kar sakte ho)
users = {
    "admin": generate_password_hash("password123"),
    "piyush": generate_password_hash("12345"),
    "PiyushSingh": generate_password_hash("98765"),

}

@app.route("/")
def home():
    if "user" in session:
        return render_template("index.html", user=session["user"])
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if username in users and check_password_hash(users[username], password):
            session["user"] = username
            flash("Login successful!", "success")
            return redirect(url_for("home"))
        else:
            flash("Invalid username or password", "danger")
            return redirect(url_for("login"))
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("user", None)
    flash("You have been logged out.", "info")
    return redirect(url_for("home"))


@app.route("/student_assist", methods=["POST"])
def student_assist():
    if "user" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("login"))

    name = request.form.get("name")
    email = request.form.get("email")
    query = request.form.get("query")

    # Later: save to database or send email
    flash("Your assistance request has been submitted!", "success")
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)
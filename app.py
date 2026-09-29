from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

from flask_sqlalchemy import SQLAlchemy



app = Flask(__name__)
app.secret_key = "your_secret_key"   # session ke liye zaroori hai


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mpia.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class StudentAssist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    query = db.Column(db.Text)


# Dummy user database (later tum ise real DB se replace kar sakte ho)


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


        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session["user"] = user.username
            flash("Login successful!", "success")
            return redirect(url_for("home"))
        else:
            flash("Invalid username or password", "danger")
            return redirect(url_for("login"))
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = generate_password_hash(request.form.get("password"))
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        flash("Registration successful!", "success")
        return redirect(url_for("login"))
    return render_template("register.html")


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

    new_query = StudentAssist(name=name, email=email, query=query)
    db.session.add(new_query)
    db.session.commit()

    # Later: save to database or send email
    flash("Your assistance request has been submitted!", "success")
    return redirect(url_for("home"))

  


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "ok"
    assert data["runtime"] == "Python Flask"

def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "Admin@MINDH2024!"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["username"] == "admin"

def test_login_invalid_credentials(client):
    res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401
    data = res.get_json()
    assert data["success"] is False

def test_auth_me(client, admin_token):
    res = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["user"]["username"] == "admin"

def test_logout(client, admin_token):
    res = client.post("/api/auth/logout", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True

    # After logout, /api/auth/me should fail
    res2 = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert res2.status_code == 401

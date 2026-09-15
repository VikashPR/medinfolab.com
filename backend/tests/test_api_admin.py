import base64

def test_admin_create_and_delete_news(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create news
    res = client.post("/api/news", headers=headers, json={
        "title": "Breakthrough in Video rPPG Accuracy",
        "description": "Our laboratory has achieved <1.0 BPM error in real-time camera vital sign detection.",
        "category": "Paper Accepted"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    news_id = data["item"]["id"]

    # Update news
    res_up = client.put(f"/api/news/{news_id}", headers=headers, json={
        "title": "Breakthrough in Video rPPG Accuracy - Updated"
    })
    assert res_up.status_code == 200
    assert res_up.get_json()["item"]["title"] == "Breakthrough in Video rPPG Accuracy - Updated"

    # Delete news
    res_del = client.delete(f"/api/news/{news_id}", headers=headers)
    assert res_del.status_code == 200
    assert res_del.get_json()["success"] is True

def test_admin_unauthorized_access(client):
    # Attempting to create news without auth should fail
    res = client.post("/api/news", json={
        "title": "Unauthorized News",
        "description": "This should be rejected."
    })
    assert res.status_code == 401
    assert res.get_json()["success"] is False

def test_admin_base64_upload(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    sample_content = b"fake image byte data"
    b64_content = base64.b64encode(sample_content).decode("utf-8")

    res = client.post("/api/admin/upload", headers=headers, json={
        "filename": "test-sensor.png",
        "mimeType": "image/png",
        "base64Data": b64_content,
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert "url" in data

    # Delete the uploaded file
    res_del = client.delete("/api/admin/upload", headers=headers, json={
        "url": data["url"]
    })
    assert res_del.status_code == 200
    assert res_del.get_json()["success"] is True

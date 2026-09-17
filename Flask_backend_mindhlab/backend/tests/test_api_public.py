def test_get_news_public(client):
    res = client.get("/api/news")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert isinstance(data["news"], list)

def test_get_team_public(client):
    res = client.get("/api/team")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert isinstance(data["members"], list)

def test_get_publications_public(client):
    res = client.get("/api/publications")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert isinstance(data["publications"], list)

def test_get_facilities_public(client):
    res = client.get("/api/facilities")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert isinstance(data["facilities"], list)

def test_get_collaborators_public(client):
    res = client.get("/api/collaborators")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert isinstance(data["collaborators"], list)

def test_submit_contact_inquiry(client):
    res = client.post("/api/contact", json={
        "name": "Dr. Jane Doe",
        "email": "jane.doe@example.com",
        "affiliation": "City Hospital",
        "interestType": "Clinical Pilot",
        "message": "We would like to pilot the contactless vital signs gantry."
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert data["inquiry"]["name"] == "Dr. Jane Doe"

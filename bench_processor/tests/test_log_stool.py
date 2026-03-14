import pytest
from sqlalchemy.orm import Session

from app.db.models import StoolRecord, User


@pytest.fixture(scope="module", autouse=True)
def seed_default_user(test_db_session: Session) -> None:
    test_db_session.add(User(user_id=1, name="Test User", email="test@example.com"))
    test_db_session.commit()


def test_insert_stool_record_writes_row(client, test_db_session: Session) -> None:
    payload = {"wetness": 0.67, "experience": 1.0}
    response = client.post("/api/1/stool", json=payload)

    assert response.status_code == 200
    assert response.json() == "created"

    rows = test_db_session.query(StoolRecord).all()
    assert len(rows) == 1
    assert rows[0].user_id == 1
    assert rows[0].wetness_rating == 0.67
    assert rows[0].experience_rating == 1.0


def test_insert_stool_record_returns_validation_error_when_user_missing(client) -> None:
    payload = {"wetness": 0.67, "experience": 1.0}
    response = client.post("/api/2/stool", json=payload)

    assert response.status_code == 400
    assert response.json() == {"message": "validation error: user_id 2 not found"}


def test_insert_stool_record_rejects_out_of_range_values(client) -> None:
    payload = {"wetness": 1.2, "experience": -0.1}
    response = client.post("/api/1/stool", json=payload)

    assert response.status_code == 422
    assert response.json()["message"].startswith("validation error:")

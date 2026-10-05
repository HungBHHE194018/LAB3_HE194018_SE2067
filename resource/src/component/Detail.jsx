import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, ListGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import getCourses from "../config/api.js";

function Detail() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCourses();
      let courseList = [];
      if (Array.isArray(res?.data)) {
        courseList = res.data;
      } else if (Array.isArray(res?.data?.courses)) {
        courseList = res.data.courses;
      } else if (Array.isArray(res?.courses)) {
        courseList = res.courses;
      } else if (Array.isArray(res)) {
        courseList = res;
      }
      setCourses(courseList);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const course = courses.find((c) => String(c.id) === String(id));

  useEffect(() => {
    if (course?.classes && course.classes.length > 0) {
      const activeClass = course.classes.find((cl) => cl.slots && cl.slots.length > 0) || course.classes[0];
      setSelectedClassId(activeClass.classId);
    }
  }, [course]);

  const currentClass = course?.classes?.find((cl) => cl.classId === selectedClassId);
  const slotsList = currentClass?.slots || [];

  useEffect(() => {
    if (slotsList.length > 0) {
      setSelectedSlotNumber(slotsList[0].slotNumber);
    } else {
      setSelectedSlotNumber(null);
    }
  }, [selectedClassId, slotsList]);

  const selectedSlot = slotsList.find((s) => s.slotNumber === selectedSlotNumber);

  if (loading) {
    return <Container className="py-5 text-center text-muted">Loading course details...</Container>;
  }

  if (!course) {
    return (
      <Container className="py-5 text-center">
        <p className="text-muted">Course not found.</p>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );
  }

  const questionsOrAssignments = selectedSlot?.questions || selectedSlot?.assignments || [];

  return (
    <Container className="py-4">
      <div className="text-muted small mb-2">
        <span>My Courses</span>
        {" / "}
        <span>{course.nameEn}</span>
        {" - "}
        <span>{course.nameVi}</span>
      </div>

      <div className="mb-3">
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="px-3"
        >
          Back
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">
          {course.nameEn} ({course.nameVi})
        </h3>
        <span className="text-muted fw-semibold">{course.code}</span>
      </div>

      <Row className="g-4">
        <Col md={5} lg={4}>
          <Card className="border border-light-subtle shadow-none mb-3">
            <Card.Header className="bg-white border-bottom border-light-subtle py-2 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark small">Classes</span>
              <Badge bg="secondary" className="bg-opacity-10 text-secondary border fw-normal">
                {course.classes?.length || 0} classes
              </Badge>
            </Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {course.classes?.map((cl) => {
                const isActive = cl.classId === selectedClassId;
                return (
                  <ListGroup.Item
                    key={cl.classId}
                    action
                    active={isActive}
                    onClick={() => setSelectedClassId(cl.classId)}
                    className={`d-flex justify-content-between align-items-center py-2 px-3 border-bottom ${
                      isActive ? "bg-dark text-white border-dark" : "text-dark"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="fw-semibold small">{cl.name}</span>
                    <span className={`small ${isActive ? "text-white-50" : "text-muted"}`} style={{ fontSize: "0.75rem" }}>
                     
                    </span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>

          <Card className="border border-light-subtle shadow-none">
            <Card.Header className="bg-white border-bottom border-light-subtle py-2 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark small">Slots</span>
              <span className="text-muted small">{slotsList.length} slots</span>
            </Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: "380px", overflowY: "auto" }}>
              {slotsList.length === 0 ? (
                <ListGroup.Item className="text-muted text-center py-4 small">
                  No slots.
                </ListGroup.Item>
              ) : (
                slotsList.map((slot) => {
                  const isActive = slot.slotNumber === selectedSlotNumber;
                  return (
                    <ListGroup.Item
                      key={slot.slotNumber}
                      action
                      active={isActive}
                      onClick={() => setSelectedSlotNumber(slot.slotNumber)}
                      className={`d-flex align-items-center p-3 border-bottom ${
                        isActive ? "bg-dark text-white border-dark" : "text-dark"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={`d-flex align-items-center justify-content-center rounded-circle me-3 fw-bold flex-shrink-0 ${
                          isActive ? "bg-white text-dark" : "bg-light text-secondary border"
                        }`}
                        style={{ width: "36px", height: "36px" }}
                      >
                        {slot.slotNumber}
                      </div>

                      <div className="d-flex flex-column small">
                        <span className="fw-semibold">{slot.date}</span>
                        <span className={isActive ? "text-white-50" : "text-muted"}>
                          {slot.time}
                        </span>
                      </div>
                    </ListGroup.Item>
                  );
                })
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={7} lg={8}>
          <Card className="border border-light-subtle shadow-none">
            <Card.Body className="p-4">
              <h5 className="fw-bold text-dark mb-4">Class Sessions</h5>

              {selectedSlot ? (
                <div>
                
                  <div className="d-flex align-items-start p-3 bg-light rounded border border-light-subtle mb-4">
                    <div
                      className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle fw-bold me-3 flex-shrink-0"
                      style={{ width: "42px", height: "42px" }}
                    >
                      {selectedSlot.slotNumber}
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">{selectedSlot.title}</h6>
                      <div className="text-muted small">
                        <span>{selectedSlot.date}</span>
                        <span className="ms-3">{selectedSlot.time}</span>
                      </div>
                    </div>
                  </div>

               
                  <div>
                    <h6 className="fw-bold text-dark mb-3">
                      {selectedSlot.questions
                        ? "Questions"
                        : selectedSlot.assignments
                        ? "Assignments"
                        : "Content"}
                    </h6>

                    {questionsOrAssignments.length > 0 ? (
                      <ListGroup variant="flush" className="border rounded">
                        {questionsOrAssignments.map((item, idx) => (
                          <ListGroup.Item key={idx} className="small py-2 text-dark">
                            {item}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-muted small p-3 bg-light rounded border">
                        {selectedSlot.content || "No questions or assignments for this slot."}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center py-5 small">
                  No data
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;
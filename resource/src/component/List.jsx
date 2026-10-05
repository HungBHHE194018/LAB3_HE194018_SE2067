import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Container,
  Badge,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import getCourses from "../config/api.js";

function List() {
  const [courses, setCourses] = useState([]);
  const [selectSemester, setSelectSemester] = useState("SUMMER2026");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    const res1 = await getCourses();
    setCourses(res1.data);
  };
  useEffect(() => {
    loadData();
  }, []);
  const filterCourses = courses.filter((c) => {
    const s1 = c.nameEn.toLowerCase().includes(search.toLowerCase());
    const s2 = !selectSemester || String(c.semester) === String(selectSemester);
    return s1 && s2;
  });
  return (
    <>
      <Row style={{ marginTop: "10px" }}>
        <Col md={1}>Courses</Col>
        <Col md={1}>Projects</Col>
        <Col md={1}>Review</Col>
        <Col md={2}>Title confirmation</Col>
        <Col md={1}>Reference</Col>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <Col>
          <Row>Welcome back, Lecturer</Row>
          <Row>
            <h2>My Courses</h2>
          </Row>
        </Col>
        <Col style={{ marginLeft: "900px" }}>
          <Row>Semester</Row>
          <Row>
            <Form.Select onChange={(e) => setSelectSemester(e.target.value)}>
              <option value={"SUMMER2026"}>SUMMER2026</option>
              <option value={"SPRING2026"}>SPRING2026</option>
              <option value={"FAL2025"}>FALL2025</option>
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col >
        <input
        style={{width: "700px"}}
        type="text"
        value={search}
        placeholder="Enter name to search ..."
        onChange={(e) => setSearch(e.target.value)}/></Col>
        <Col style={{marginLeft: "500px"}}>
        {filterCourses.length} courses</Col>
      </Row>
      <Row>
        {filterCourses.map((c) =>(
          <Col key={c.id} md = {3}>
            <Card style={{marginTop: "30px"}}>
              <Row>
                <Col style={{fontSize: "12px"}}>{c.badge}</Col>
                <Col style={{fontSize: "12px", marginLeft: "160px"}}>{c.category}</Col>
              </Row>
              <Row style={{fontSize: "12px", marginLeft: "10px"}}>{c.code}</Row>
              <Row>
                <strong style={{fontSize: "15px"}}>{c.nameEn}</strong>
              </Row>
              <Row style={{fontSize: "13px", marginLeft: "8px"}}>
                {c.nameVi}
              </Row>
              <Button
              style={{backgroundColor: "white", color: "black"}}
              as = {Link}
              to={`/detail/${c.id}`}>
                Get started
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default List;

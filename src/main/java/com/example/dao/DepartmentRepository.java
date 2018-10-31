package com.example.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_department;

public interface DepartmentRepository extends JpaRepository<Tb_department, Integer>{
	//根据系列信息进行删除
	@Query(value = "delete from tb_department where department=?1 ", nativeQuery = true)  
	@Modifying
	@Transactional
	public void deleteBydepartment(String department);
}

package com.example.dao;


import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_colour;

public interface ColourRepository extends JpaRepository<Tb_colour, Integer>{
	
	//根据颜色信息进行删除
	@Query(value = "delete from tb_colour where colour_info =?1 ", nativeQuery = true)  
	@Modifying
	@Transactional
	public void deleteByColour(String colourInfo);
}

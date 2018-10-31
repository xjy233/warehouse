package com.example.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.ShelfRepository;
import com.example.module.Tb_shelf;
import com.example.service.ShelfService;

@Service
public class ShelfServiceImpl implements ShelfService{
	@Autowired
	private ShelfRepository shelfRepository;
	@Override
	public void add(Tb_shelf tb_shelf) {
		shelfRepository.save(tb_shelf);
	}

	@Override
	public void deleteById(int Id) {
		shelfRepository.delete(Id);
	}

	@Override
	public Tb_shelf findById(int Id) {
		return shelfRepository.findOne(Id);
	}


	@Override
	public void updateCol(int shelfId,int col) {
		shelfRepository.updateCol(shelfId,col);
	}

	@Override
	public List<String> sortShelfNum() {
		//得到所有的货架号
		List<Tb_shelf> listShelf = shelfRepository.findAll();
		List<String> allShelfNum = new ArrayList<String>();
		for(Tb_shelf tb_shelf:listShelf){
			String shelfNum = tb_shelf.getShelfNumber();
			allShelfNum.add(shelfNum);
		}
		//将货架号变为int类型
		int[] intShelfNums = new int[allShelfNum.size()];
		int tem;
		for(int i=0;i<allShelfNum.size();i++){
			intShelfNums[i] = Integer.parseInt(allShelfNum.get(i));
		}
		//给货架号从低到高排序
		for(int i=0;i<allShelfNum.size();i++){
			for(int j=0;j<allShelfNum.size();j++){
				if(j==allShelfNum.size()-1){
					break;
				}
				if(intShelfNums[j]>intShelfNums[j+1]){
					tem = intShelfNums[j+1];
					intShelfNums[j+1] = intShelfNums[j];
					intShelfNums[j] = tem;
				}
			}
		}
		
		//将货架号由int类型又变回string
		allShelfNum.clear();
		for(int i=0;i<intShelfNums.length;i++){
			String strShelfNum = String.format("%02d", intShelfNums[i]);
			allShelfNum.add(strShelfNum);
		}
		return allShelfNum;
	}
	
}

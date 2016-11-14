package com.app.formation.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author hicham and mohamed
 *
 */
@RestController
public class TestController {
   
	@RequestMapping(value = "/")
	public Map<String, String> test() {
		Map<String, String> maps = new HashMap<String, String>();
		maps.put("key1", "hicham");
		maps.put("key2", "Mohamed");

		return maps;
	}

}

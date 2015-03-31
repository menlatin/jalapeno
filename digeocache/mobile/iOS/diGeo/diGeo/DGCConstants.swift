//
//  DGCConstants.swift
//  diGeo
//
//  Created by Elliott Richerson on 3/11/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import Foundation

let URL_ELLIOTT: String = "http://elliott.webfactional.com/"
//let URL_LOCAL: String = "http://localhost:3000"

// API Operations

// GET
let GET_FEED: String = "events"
let GET_CATEGORIES: String = "categories"

// POST

// Singleton
private let _DGCConstantsSharedInstance = DGCConstants()

class DGCConstants {
    var isTestEnvironment: Bool = true
    var host: String = ""
    var requestManager: String = ""
    
    class var sharedInstance: DGCConstants {
        return _DGCConstantsSharedInstance
    }
    
}
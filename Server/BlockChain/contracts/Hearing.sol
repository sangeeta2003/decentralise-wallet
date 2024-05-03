// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Hearing {
    enum CaseWorking {
        ONGOING,
        PENDING,
        CLOSED
    }

    enum CaseType {
        CRIMINAL,
        CIVIL,
        FAMILY
    }

    enum UserType {
        JUDGE,
        LAWYER,
        DEFENDANT,
        PLAINTIFF
    }

    struct CASE {
        uint256 date;
        CaseWorking caseWorking;
        CaseType caseType;
        string doc;
        string caseNumber;
        string names;
        address judge;
        address lawyer;
        address defendant;
        address plaintiff;
    }

    //User Type Assigning
    mapping(UserType => address[]) private _userTypes;
    mapping(address => UserType) private _specificUserTypes;

    //Storing Cases
    mapping(uint256 => CASE) _cases;
    mapping(address => uint256[]) private _judges;
    mapping(address => uint256[]) private _lawyers;
    mapping(address => uint256[]) private _defendant;
    mapping(address => uint256[]) private _plaintiff;

    constructor() {}

    //Working with Enum
    function caseWorkingSwitch(uint index) internal pure returns (CaseWorking) {
        if (index == 0) {
            return CaseWorking.ONGOING;
        } else if (index == 1) {
            return CaseWorking.PENDING;
        } else {
            return CaseWorking.CLOSED;
        }
    }

    function caseWorkingSwitchReverse(
        CaseWorking caseWorking
    ) internal pure returns (string memory) {
        if (caseWorking == CaseWorking.ONGOING) {
            return "ongoing";
        } else if (caseWorking == CaseWorking.PENDING) {
            return "pending";
        } else {
            return "closed";
        }
    }

    function caseTypeSwitch(uint index) internal pure returns (CaseType) {
        if (index == 0) {
            return CaseType.CRIMINAL;
        } else if (index == 1) {
            return CaseType.CIVIL;
        } else {
            return CaseType.FAMILY;
        }
    }

    function caseTypeSwitchReverse(
        CaseType caseType
    ) internal pure returns (string memory) {
        if (caseType == CaseType.CRIMINAL) {
            return "criminal";
        } else if (caseType == CaseType.CIVIL) {
            return "civil";
        } else {
            return "family";
        }
    }

    //Adding Cases
    function pushJudgeCase(address id, uint256 newRecordId) internal {
        if (_judges[id].length == 0) {
            _judges[id] = [newRecordId];
            _userTypes[UserType.JUDGE] = [id];
        } else {
            _judges[id].push(newRecordId);
            _userTypes[UserType.JUDGE].push(id);
        }
    }

    function pushLawyerCase(address id, uint256 newRecordId) internal {
        if (_lawyers[id].length == 0) {
            _lawyers[id] = [newRecordId];
            _userTypes[UserType.LAWYER] = [id];
        } else {
            _lawyers[id].push(newRecordId);
            _userTypes[UserType.LAWYER].push(id);
        }
    }

    function pushDefendantCase(address id, uint256 newRecordId) internal {
        if (_defendant[id].length == 0) {
            _defendant[id] = [newRecordId];
            _userTypes[UserType.DEFENDANT] = [id];
        } else {
            _defendant[id].push(newRecordId);
            _userTypes[UserType.DEFENDANT].push(id);
        }
    }

    function pushPlaintiffCase(address id, uint256 newRecordId) internal {
        if (_plaintiff[id].length == 0) {
            _plaintiff[id] = [newRecordId];
            _userTypes[UserType.PLAINTIFF] = [id];
        } else {
            _plaintiff[id].push(newRecordId);
            _userTypes[UserType.PLAINTIFF].push(id);
        }
    }

    function checkUserExists(UserType userType) internal returns (bool) {
        // _QuestionMap[id].users
        for (uint256 i = 0; i < _userTypes[userType].length; i++) {
            if (_userTypes[userType][i] == msg.sender) {
                return true;
            }
        }

        _userTypes[userType].push(msg.sender);
        _specificUserTypes[msg.sender] = userType;

        return false;
    }

    //Registering User According to its Type
    function registeringUserType(uint index) public {
        if (index == 0) {
            checkUserExists(UserType.JUDGE);
        } else if (index == 1) {
            checkUserExists(UserType.LAWYER);
        } else if (index == 2) {
            checkUserExists(UserType.DEFENDANT);
        } else {
            checkUserExists(UserType.PLAINTIFF);
        }
    }

    // //CASE Adding
    function addCase(
        uint256 date,
        uint caseWorkingIndex,
        uint caseTypeIndex,
        string memory doc,
        string memory caseNumber,
        string memory names,
        address judge,
        address lawyer,
        address defendant,
        address plaintiff
    ) public returns (uint256) {
        registeringUserType(0);
        require(
            _specificUserTypes[msg.sender] == UserType.JUDGE ||
                _specificUserTypes[msg.sender] == UserType.LAWYER,
            "Not Authorized"
        );
        // require(
        //     block.timestamp < (date / 1000),
        //     "Case Should be in the Future"
        // );
        require(judge != address(0), "Judge Address should be there");
        require(lawyer != address(0), "Lawyer Address should be there");
        require(defendant != address(0), "Defendant Address should be there");
        require(plaintiff != address(0), "Plaintiff Address should be there");

        CASE memory tempCase;

        tempCase.date = date;
        tempCase.caseWorking = caseWorkingSwitch(caseWorkingIndex);
        tempCase.caseType = caseTypeSwitch(caseTypeIndex);
        tempCase.doc = doc;
        tempCase.caseNumber = caseNumber;
        tempCase.names = names;
        tempCase.judge = judge;
        tempCase.lawyer = lawyer;
        tempCase.defendant = defendant;
        tempCase.plaintiff = plaintiff;

        //New Record Id
        uint256 newRecordId = uint256(
            keccak256(abi.encodePacked(msg.sender, block.timestamp))
        );

        _cases[newRecordId] = tempCase;

        // Record for Judge
        pushJudgeCase(judge, newRecordId);
        //Record for Lawyer
        pushLawyerCase(lawyer, newRecordId);
        //Record for Defendant
        pushDefendantCase(defendant, newRecordId);
        //Record for Plaintiff
        pushPlaintiffCase(plaintiff, newRecordId);

        return newRecordId;
    }

    // //Reading the Cases
    function readCases()
        public
        view
        returns (
            // returns (
            //     uint256,
            //     string memory,
            //     string memory,
            //     string memory,
            //     string memory,
            //     string[] memory,
            //     address,
            //     address,
            //     address,
            //     address
            // )
            uint256[] memory
        )
    {
        UserType tempUserType = _specificUserTypes[msg.sender];
        uint256[] memory tempCases;

        if (tempUserType == UserType.JUDGE) {
            tempCases = _judges[msg.sender];
        } else if (tempUserType == UserType.LAWYER) {
            tempCases = _lawyers[msg.sender];
        } else if (tempUserType == UserType.DEFENDANT) {
            tempCases = _defendant[msg.sender];
        } else if (tempUserType == UserType.PLAINTIFF) {
            tempCases = _plaintiff[msg.sender];
        }

        return tempCases;

        // CASE[] memory tempCasesData;

        // for (uint256 i = 0; i < tempCases.length; i++) {
        //     CASE memory tempCase = _cases[tempCases[i]];
        //     // if (tempCasesData.length == 0) {
        //     //     tempCasesData = [tempCase];
        //     // } else {
        //     //     tempCasesData.push(tempCase);
        //     // }

        //     return tempCase;
        //     // uint256 date = tempCase.date;
        //     // string memory caseWorking = caseWorkingSwitchReverse(
        //     //     tempCase.caseWorking
        //     // );
        //     // string memory caseType = caseTypeSwitchReverse(tempCase.caseType);
        //     // string memory doc = tempCase.doc;
        //     // string memory caseNumber = tempCase.caseNumber;
        //     // string[] memory names = tempCase.names;
        //     // address judge = tempCase.judge;
        //     // address lawyer = tempCase.lawyer;
        //     // address defendant = tempCase.defendant;
        //     // address plaintiff = tempCase.plaintiff;

        //     // return (
        //     //     date,
        //     //     caseWorking,
        //     //     caseType,
        //     //     doc,
        //     //     caseNumber,
        //     //     names,
        //     //     judge,
        //     //     lawyer,
        //     //     defendant,
        //     //     plaintiff
        //     // );

        //     // string memory namesCombined = "";
        //     // for (uint256 j; j < names.length; i++) {
        //     //     namesCombined += names[j] + ",";
        //     // }

        //     // string[] memory data = [
        //     //     date,
        //     //     caseWorking,
        //     //     caseType,
        //     //     doc,
        //     //     caseNumber,
        //     //     namesCombined,
        //     //     judge,
        //     //     lawyer,
        //     //     defendant,
        //     //     plaintiff
        //     // ];

        //     // tempCase.date = date;
        //     // tempCase.caseWorking = caseWorkingSwitch(caseWorkingIndex);
        //     // tempCase.caseType = caseTypeSwitch(caseTypeIndex);
        //     // tempCase.doc = doc;
        //     // tempCase.caseNumber = caseNumber;
        //     // tempCase.names = names;
        //     // tempCase.judge = judge;
        //     // tempCase.lawyer = lawyer;
        //     // tempCase.defendant = defendant;
        //     // tempCase.plaintiff = plaintiff;
        // }

        // return tempCases;
    }

    //Enum Details
    function CaseWorkingIndexView() public pure returns (string[3] memory) {
        string[3] memory data = ["ongoing", "pending", "closed"];
        return data;
    }

    function CaseTypeIndexView() public pure returns (string[3] memory) {
        string[3] memory data = ["criminal", "civil", "family"];
        return data;
    }

    function userTypeIndexView() public pure returns (string[4] memory) {
        string[4] memory data = ["judge", "lawyer", "defendant", "plaintiff"];
        return data;
    }
}

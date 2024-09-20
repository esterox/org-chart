import React, { useState } from 'react';

///////////this can change api request
const getInitRequest = ()=>{
    return  {
        id: 1,
        member_id: null,
        company_id: 2,
        created_at: null,
        updated_at: null,
        members: [
            {
                id: 1,
                position: "",
                branch_id: 1,
                user_id: null,
                created_at: null,
                updated_at: null,
                branches: []
            },
        ]
    }
}

const addBranchRequest = () =>{
    const newBranchId = Date.now();
    const newMemberId = Date.now() + 1;
    return  {
        id: newBranchId,
        member_id: 2,
        company_id: 2,
        created_at: null,
        updated_at: null,
        members: [
            {
                id: newMemberId,
                position: "",
                branch_id: newBranchId,
                user_id: null,
                created_at: null,
                updated_at: null,
                branches: []
            }
        ]
    };
}

const addMemberRequest = (branchId) =>{
    return  {
        id: Date.now(),
        position: '',
        branch_id: branchId,
        user_id: null,
        created_at: null,
        updated_at: null,
        branches: []
    }
}




const NodeTree = ({
      node,
      onRemove,
      onAddMember,
      onAddBranch,
      countBranch,
      onUpdateUserId,
      onUpdateBranch,
      onUpdatePosition,
      level = 0
   }) => {

    const [inputValues, setInputValues] = useState(
        node?.members?.reduce((acc, member) => {
            acc[member?.id] = member?.position;
            return acc;
        }, {})
    );

    const [selectedUser, setSelectedUser] = useState(
        node?.members?.reduce((acc, member) => {
            acc[member?.id] = member?.user_id;
            return acc;
        }, {})
    );

    const handleInputChange = (id, value) => {
        setInputValues({
            ...inputValues,
            [id]: value
        });
    };

    const handleBlur = (id, value) => {
        onUpdatePosition(id, value);
    };

    const handleUserChange = (id, userId) => {
        setSelectedUser({
            ...selectedUser,
            [id]: userId
        });
        onUpdateUserId(id, userId);
    };
    return (
        <div className={`${countBranch > 1 && 'forLine'} nodeItem`}>
            <ul className={`tree`}>
                {level>0 && (
                    <div className="button">
                        <div className="lineTop" />
                        <div className={'button-group'}>
                            <button onClick={() => onAddMember(node?.members[0]?.branch_id)}>+</button>
                            <button onClick={() => onRemove(node?.members[0]?.branch_id,'ALL')}>-</button>
                        </div>
                        {node?.members && (
                            <div className="lineBottom" style={{width: node?.members?.length > 1 ? 0 : 1}}/>
                        )}

                    </div>
                )}

                {node?.members && node?.members?.length > 1 && (
                        <div className="horizontalLine"></div>
                )}

                {node?.members?.map((member) => {
                    return (
                        <li
                            key={member.id}
                            className={`level ${node?.members?.length > 1?'Line_v':''}`}
                            style={{
                                position: 'relative',
                                display: node?.members?.length > 1 ? 'flex' : 'inline-block',
                                gap: node?.members?.length > 1 ? '10px' : '0',
                                marginBottom: '10px',
                            }}
                        >
                            <div className={`node`}>
                                {node?.members?.length > 1 && member?.branches?.length > 1 && <div className="lineRight"/>}
                                <input
                                    value={inputValues[member.id] || ''}
                                    placeholder='Possition'
                                    onChange={(e) => handleInputChange(member.id, e.target.value)}
                                    onBlur={(e) => handleBlur(member.id, e.target.value)}
                                />

                                <select
                                    value={selectedUser[member.id] || ''}
                                    onChange={(e) => handleUserChange(member.id, e.target.value)}
                                >
                                    <option value="">Select User</option>
                                    <option value={1}>Member 1</option>
                                    <option value={2}>Member 2</option>
                                    <option value={3}>Member 3</option>
                                </select>

                                <button onClick={() => onAddBranch(member?.id,member?.branch_id)}>+</button>
                                {level>0 && (
                                    <button onClick={() => {
                                        if (node?.members?.length > 1) {
                                            onRemove(member?.branch_id, 'PER', member?.id)
                                        } else {
                                            onUpdateBranch(member?.branch_id, member?.id)
                                        }
                                    }}>-</button>
                                )}

                                {node?.members?.length > 1 && <div className="lineLeft"/>}
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <div className="lineBottom"
                                     style={{width: node?.members?.length < 2 && member?.branches?.length >= 1 ? 1 : 0}}/>
                            </div>

                            {member?.branches && member?.branches?.length > 0 && (
                                <ul
                                    style={{
                                        display: 'flex',
                                        marginTop: node?.members?.length > 1 ? '30px' : '0',
                                        marginLeft: node?.members?.length > 1 ? '-4px' : '0',
                                    }}
                                    className={node?.members?.length > 1 ?'member_branch' :''}
                                >
                                    <>
                                        {/*{node.members.length > 1 && member.branches.length > 0 &&*/}
                                        {/*    <div className="lineToBranch"/>}*/}
                                        {member?.branches.map((branch) => (
                                            <NodeTree
                                                key={branch.id}
                                                node={branch}
                                                onAddBranch={onAddBranch}
                                                onAddMember={onAddMember}
                                                onRemove={onRemove}
                                                countBranch={member?.branches?.length}
                                                level={level + 1}
                                                onUpdatePosition={onUpdatePosition}
                                                onUpdateUserId={onUpdateUserId}
                                                onUpdateBranch={onUpdateBranch}
                                            />
                                        ))}
                                    </>
                                </ul>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

const OrgChart = ({
      onRemove,
      orgChart,
      onAddBranch,
      onAddMember,
      onUpdateUserId,
      onUpdateBranch,
      onUpdatePosition
    }) => {
    return (
        <div className="tree-container">
            {orgChart.map((root,index) => (
                <NodeTree
                    key={index}
                    node={root}
                    onAddBranch={onAddBranch}
                    onAddMember={onAddMember}
                    onRemove={onRemove}
                    onUpdatePosition={onUpdatePosition}
                    onUpdateUserId={onUpdateUserId}
                    onUpdateBranch={onUpdateBranch}
                />
            ))}
        </div>
    );
};

const App = () => {
    const [data, setData] = useState(null);

    const initChart = () => {
        const result = getInitRequest()
        setData([result]);
    };

    const addBranchToMember = (alldata, memberId, branchId, newBranch) => {
        if (alldata.id === memberId && alldata.branch_id === branchId) {
            if (!alldata.branches) {
                alldata.branches = [];
            }
            alldata.branches.push(newBranch);
            return alldata;
        }

        return {
            ...alldata,
            members: alldata.members
                ? alldata.members.map(member => addBranchToMember(member, memberId, branchId, newBranch))
                : [],
            branches: alldata.branches
                ? alldata.branches.map(branch => addBranchToMember(branch, memberId, branchId, newBranch))
                : []
        };
    }

    const addBranch = (memberId, parentId) => {
        const newBranch =  addBranchRequest()
        let result = addBranchToMember(data[0], memberId, parentId, newBranch);
        setData([result])
    };

    const addMemberToBranch = (branchId) => {
        console.log('<<ADD MEMBER TO BRANCH>> BRANCH ID->', branchId);
        const newMember =  addMemberRequest(branchId)
        const addMemberToMatchingBranch = (nodes) => {
            return nodes.map((node) => {
                if (node.id === branchId) {
                    return {...node, members: [...node.members, newMember]};
                } else {
                    return {
                        ...node,
                        branches: addMemberToMatchingBranch(node.branches || []),
                        members: addMemberToMatchingBranch(node.members || [])
                    };
                }
            });
        };
        setData((prevData) => addMemberToMatchingBranch(prevData || []));
    };

    const removeNode = (branchId,type,memberId) => {

        const removeNodeFromTree = (nodes) => {
            return nodes
                .filter(node => node.id !== memberId)
                .map(node => {
                    const updatedBranches = removeNodeFromTree(node.branches || []);
                    const updatedMembers = removeNodeFromTree(node.members || []);
                    if (node.id === branchId ) {
                        if(type === 'ALL'){
                            if (node?.members?.length >= 1 && node.members[0].branch_id === node.id) {
                                return null;
                            }
                        }else{
                            if (node?.members?.length === 1 && node.members[0].branch_id === node.id) {
                                return null;
                            }
                        }

                    }
                    return {
                        ...node,
                        branches: updatedBranches,
                        members: updatedMembers
                    };
                })
                .filter(node => node !== null);
        };
        setData(prevData => removeNodeFromTree(prevData || []));
    };

    const mapAllBranches = (nodes, callback) => {
        const traverseNodes = (nodes, prevNode = null, prevPrevNode = null) => {
            nodes.forEach(node => {
                callback(node, prevNode, prevPrevNode);
                if (node.branches && node.branches.length) {
                    traverseNodes(node.branches, node, prevNode);
                }
                if (node.members && node.members.length) {
                    traverseNodes(node.members, node, prevNode);
                }
            });
        };
        traverseNodes(nodes);
    };

    const updateBranch = (branchIdToDelete,memberId) => {
        console.log('<<DELETE BRANCH>>', 'BRANCH-ID->', branchIdToDelete);
        let branchFound = false;
        let branchesToMove = [];
        mapAllBranches(data, (node, prevNode) => {
            if (branchIdToDelete === node.id && !branchFound) {
                branchFound = true;
                if (node.members && node.members.length > 0) {
                    branchesToMove = node.members[0].branches || [];
                    if (prevNode) {
                        const updatedBranches = branchesToMove.map(branch => ({
                            ...branch,
                            branch_id: prevNode.id
                        }));
                        prevNode.branches = [...(prevNode.branches || []), ...updatedBranches];
                    }
                }
                return;
            }
        });
        const removeBranchFromTree = (nodes) => {
            return nodes
                .filter(node => node.id !== branchIdToDelete)
                .map(node => ({
                    ...node,
                    branches: removeBranchFromTree(node.branches || []),
                    members: removeBranchFromTree(node.members || [])
                }));
        };
        setData(prevData => {
            return removeBranchFromTree(prevData || []);
        });
    };

    const updatePosition = (id, newPosition) => {
        console.log('<<UPDATE POSITION>>', 'MEMBER ID ->',id, 'POSITION->',newPosition);
        const updateTree = (nodes) => {
            return nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, position: newPosition };
                } else {
                    return {
                        ...node,
                        branches: updateTree(node.branches || []),
                        members: updateTree(node.members || [])
                    };
                }
            });
        };
        setData((prevData) => updateTree(prevData));
    };

    const updateUserId = (id, newUserId) => {
        console.log('<<UPDATE USER_ID>>', 'MEMBER ID ->',id, 'SELECTED USER ID->',newUserId);
        const updateTree = (nodes) => {
            return nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, user_id: newUserId };
                } else {
                    return {
                        ...node,
                        branches: updateTree(node.branches || []),
                        members: updateTree(node.members || [])
                    };
                }
            });
        };
        setData((prevData) => updateTree(prevData));
    };

    return (
        <div>
            {data ? (
                <OrgChart
                    orgChart={data}
                    onAddBranch={addBranch}
                    onAddMember={addMemberToBranch}
                    onRemove={removeNode}
                    onUpdatePosition={updatePosition}
                    onUpdateUserId={updateUserId}
                    onUpdateBranch={updateBranch}
                />
            ) : (
                <div>
                    <p>Create chart <button onClick={initChart}>Create</button></p>
                </div>
            )}
        </div>
    );
};

export default App;

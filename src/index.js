import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import matchSorter from "match-sorter";

import Select from "react-select";
import "react-select/dist/react-select.css";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData(),
      filtered: [],
      select2: undefined
    };
  }

  onFilteredChangeCustom = (value, accessor) => {
    let filtered = this.state.filtered;
    let insertNewFilter = 1;
    console.log("val ", value);
    console.log("accessor ", accessor);
    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) filtered.splice(i, 1);
          else filter["value"] = value;

          insertNewFilter = 0;
        }
      });
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value });
    }

    this.setState({ filtered: filtered });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <pre>{JSON.stringify(this.state.filtered, null, 2)}</pre>
        <br />
        <br />

        <ReactTable
          data={data}
          filterable
          getTheadFilterThProps={() => {
            return {
              style: { overflow: "visible" }
            };
          }}
          filtered={this.state.filtered}
          onFilteredChange={(filtered, column, value) => {
            this.onFilteredChangeCustom(value, column.id || column.accessor);
          }}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            if (typeof filter.value === "object") {
              return row[id] !== undefined
                ? filter.value.indexOf(row[id]) > -1
                : true;
            } else {
              return row[id] !== undefined
                ? String(row[id]).indexOf(filter.value) > -1
                : true;
            }
          }}
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName",
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Select
                        style={{ width: "50%", marginBottom: "20px" }}
                        onChange={entry => {
                          this.setState({ select2: entry });
                          this.onFilteredChangeCustom(
                            entry.map(o => {
                              return o.value;
                            }),
                            "firstName"
                          );
                        }}
                        value={this.state.select2}
                        multi={true}
                        options={this.state.data.map((o, i) => {
                          return {
                            id: i,
                            value: o.firstName,
                            label: o.firstName
                          };
                        })}
                      />
                    );
                  }
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age",
                  Filter: ({ filter, onChange }) => {
                    return (
                      <div style={{ display: "flex" }}>
                        <input
                          value={this.state.filtered[filter]}
                          type="number"
                          onChange={event => {
                            let selectedOptions = [].slice
                              .call(event.target.value)
                              .map(o => {
                                return parseInt(o, 10);
                              });

                            let selectedMinAge = [selectedOptions[0], 100];

                            this.onFilteredChangeCustom(selectedMinAge, "age");
                          }}
                          style={{
                            width: "70px",
                            marginRight: "0.5rem"
                          }}
                        />
                        to
                        <input
                          value={this.state.filtered[filter]}
                          type="number"
                          onChange={e => {
                            console.log(e.target.value);
                          }}
                          style={{
                            width: "70px",
                            marginLeft: "0.5rem"
                          }}
                        />
                      </div>
                    );
                  }
                },
                {
                  Header: "Over 21",
                  accessor: "age",
                  id: "over",
                  Cell: ({ value }) => (value >= 21 ? "Yes" : "No"),
                  filterMethod: (filter, row) => {
                    if (filter.value.indexOf("all") > -1) {
                      return true;
                    }
                    if (filter.value.indexOf("true") > -1) {
                      return row[filter.id] >= 21;
                    }
                    return row[filter.id] < 21;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <select
                        onChange={event => {
                          let selectedOptions = [].slice
                            .call(event.target.selectedOptions)
                            .map(o => {
                              return o.value;
                            });

                          this.onFilteredChangeCustom(selectedOptions, "over");
                        }}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : ["all"]}
                        multiple={true}
                      >
                        <option value="all">Show All</option>
                        <option value="true">Can Drink</option>
                        <option value="false">Can't Drink</option>
                      </select>
                    );
                  }
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
